const Estudiante = require('../models/Estudiante'); 
const Tutor = require('../models/Tutor');         
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const { log } = require('../utils/logger'); 

const JWT_SECRET = process.env.JWT_SECRET || 'mentorifyfy'; 

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;
    
    log('INFO', `Intento de registro para email: ${correo} con rol: ${rol}`);

    try {
        const estExists = await Estudiante.findOne({ correo });
        const tutExists = await Tutor.findOne({ correo });
        
        if (estExists || tutExists) {
            log('WARNING', `Fallo registro: El correo ${correo} ya existe.`);
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        let newUser;
        
        if (rol === 'Tutor') {
            newUser = new Tutor({ 
                nombre, 
                correo, 
                contrasena: hashedPassword, 
                rol: 'Tutor', 
                especialidad: req.body.especialidad || 'General' 
            });
        } else {
            newUser = new Estudiante({ 
                nombre, 
                correo, 
                contrasena: hashedPassword, 
                rol: 'Estudiante', 
                carrera: req.body.carrera || 'General' 
            });
        }
        
        await newUser.save();
        
        log('INFO', `Usuario registrado exitosamente: ${newUser._id} (${rol})`);

        res.status(201).json({
            message: `${rol} registrado exitosamente.`,
            token: generateToken(newUser._id),
            userId: newUser._id
        });
        
    } catch (error) {
        log('ERROR', `Excepción en registro: ${error.message}`);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
                message: 'Error de Validación: ' + messages.join(', ') 
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }
        
        res.status(500).json({ 
            message: 'Error interno del servidor.', 
            error: error.message 
        });
    }
};

exports.loginUser = async (req, res) => {
    const { correo } = req.body;
    log('INFO', `Intento de inicio de sesión: ${correo}`);

    try {
        let user = await Estudiante.findOne({ correo }) || await Tutor.findOne({ correo });
        
        if (!user) {
            log('WARNING', `Login fallido: Usuario no encontrado (${correo})`);
            return res.status(401).json({ message: 'Credenciales inválidas: Usuario no encontrado.' });
        }
        
        const isMatch = await bcrypt.compare(req.body.contrasena, user.contrasena);

        if (!isMatch) {
            log('WARNING', `Login fallido: Contraseña incorrecta para ${correo}`);
            return res.status(401).json({ message: 'Credenciales inválidas: Contraseña incorrecta.' });
        }

        log('INFO', `Login exitoso: ${user._id}`);

        res.json({
            message: 'Inicio de sesión exitoso.',
            token: generateToken(user._id), 
            user: { id: user._id, nombre: user.nombre, rol: user.rol }
        });
        
    } catch (error) {
        log('ERROR', `Excepción en login: ${error.message}`);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

exports.getTutorProfile = async (req, res) => {
    try {
        const tutorId = req.params.id;
        const tutor = await Tutor.findById(tutorId).select('nombre especialidad rating_promedio foto_perfil biografia');
        if (!tutor) return res.status(404).json({ message: 'Tutor no encontrado.' });
        
        let isFollowing = false;
        const studentToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        if (studentToken) { 
            try {
                const decoded = jwt.verify(studentToken, JWT_SECRET);
                const estudiante = await Estudiante.findById(decoded.id);
                if (estudiante && estudiante.tutores_seguidos.map(id => id.toString()).includes(tutorId.toString())) isFollowing = true;
            } catch (authError) {}
        }
        res.json({ ...tutor.toObject(), isFollowing });
    } catch (error) {
        log('ERROR', `Error al obtener perfil tutor: ${error.message}`);
        res.status(500).json({ message: 'Error al obtener el perfil.', error: error.message });
    }
};

exports.getAllTutors = async (req, res) => {
    try {
        const { search } = req.query; 
        let query = {};
        if (search) {
            query.$or = [{ nombre: { $regex: search, $options: 'i' } }, { especialidad: { $regex: search, $options: 'i' } }];
        }
        const tutores = await Tutor.find(query).select('nombre especialidad biografia rating_promedio foto_perfil').limit(10); 
        res.json(tutores);
    } catch (error) {
        log('ERROR', `Error listando tutores: ${error.message}`);
        res.status(500).json({ message: 'Error al obtener tutores.', error: error.message });
    }
};

exports.toggleFollow = async (req, res) => {
    const studentId = req.userId;
    const tutorId = req.params.tutorId;
    try {
        const estudiante = await Estudiante.findById(studentId);
        if (!estudiante) return res.status(404).json({ message: 'Estudiante no encontrado.' });
        
        const isFollowing = estudiante.tutores_seguidos.includes(tutorId);
        if (isFollowing) {
            estudiante.tutores_seguidos.pull(tutorId);
            await estudiante.save();
            log('INFO', `Usuario ${studentId} dejó de seguir a ${tutorId}`);
            res.json({ isFollowing: false, message: 'Dejaste de seguir.' });
        } else {
            estudiante.tutores_seguidos.push(tutorId);
            await estudiante.save();
            log('INFO', `Usuario ${studentId} comenzó a seguir a ${tutorId}`);
            res.json({ isFollowing: true, message: 'Ahora sigues al tutor.' });
        }
    } catch (error) {
        log('ERROR', `Error en follow: ${error.message}`);
        res.status(500).json({ message: 'Error seguimiento.', error: error.message });
    }
};

exports.getFollowedTutors = async (req, res) => {
    try {
        const estudiante = await Estudiante.findById(req.userId).populate('tutores_seguidos', 'nombre especialidad rating_promedio foto_perfil');
        if (!estudiante) return res.status(404).json({ message: 'Estudiante no encontrado.' });
        res.json(estudiante.tutores_seguidos);
    } catch (error) {
        log('ERROR', `Error listando seguidos: ${error.message}`);
        res.status(500).json({ message: 'Error lista seguidos.', error: error.message });
    }
};