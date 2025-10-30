const Estudiante = require('../models/Estudiante');
const Tutor = require('../models/Tutor');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_debes_cambiar_esto'; 

exports.registerUser = async (req, res) => {
    try {
        const { nombre, correo, contrasena, rol } = req.body;

        const userExists = await Estudiante.findOne({ correo }) || await Tutor.findOne({ correo });
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        let newUser;
        if (rol === 'Estudiante') {
            newUser = new Estudiante({ ...req.body, contrasena: hashedPassword, rol: 'Estudiante' });
        } else if (rol === 'Tutor') {
            newUser = new Tutor({ ...req.body, contrasena: hashedPassword, rol: 'Tutor' });
        } else {
            return res.status(400).json({ message: 'Rol de usuario inválido.' });
        }

        await newUser.save();

        res.status(201).json({ 
            message: `${rol} registrado exitosamente.`,
            userId: newUser._id
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario.', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        let user = await Estudiante.findOne({ correo });
        if (!user) {
             user = await Tutor.findOne({ correo });
        }
        
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas: Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas: Contraseña incorrecta.' });
        }

        const token = jwt.sign(
            { id: user._id, rol: user.rol }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ 
            message: 'Inicio de sesión exitoso.',
            token, 
            user: { 
                id: user._id, 
                nombre: user.nombre, 
                correo: user.correo, 
                rol: user.rol 
            } 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor durante el login.', error: error.message });
    }
};