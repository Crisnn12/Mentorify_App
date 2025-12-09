const Clase = require('../models/Clase');
const Tutor = require('../models/Tutor');

exports.getClasses = async (req, res) => {
    try {
        const { search, materia } = req.query; 
        let query = {};

        if (materia) {
            query.materia = materia;
        }

        if (search) {
            query.$or = [
                { titulo: { $regex: search, $options: 'i' } },
                { descripcion: { $regex: search, $options: 'i' } }
            ];
        }

        const clases = await Clase.find(query)
                                  .populate('tutor', 'nombre especialidad foto_perfil') // ⬅️ Añadido foto_perfil
                                  .limit(20); 

        res.json(clases);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar clases.', error: error.message });
    }
};

exports.getClassById = async (req, res) => {
    try {
        // 🚨 CAMBIO IMPORTANTE: Agregamos 'foto_perfil' y 'especialidad' al populate
        const clase = await Clase.findById(req.params.id)
                                 .populate('tutor', 'nombre biografia foto_perfil especialidad');

        if (!clase) {
            return res.status(404).json({ message: 'Clase no encontrada.' });
        }
        
        res.json(clase);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la clase.', error: error.message });
    }
};

exports.getLiveClasses = async (req, res) => {
    try {
        const clasesEnVivo = await Clase.find({ esta_en_vivo: true })
                                        .populate('tutor', 'nombre especialidad foto_perfil') // ⬅️ Añadido foto_perfil
                                        .limit(10);
        res.json(clasesEnVivo);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener clases en vivo.', error: error.message });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { titulo, descripcion, materia, duracion, url_stream, tutorId } = req.body;

        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor no encontrado.' });
        }

        const newClase = new Clase({
            tutor: tutorId,
            titulo,
            descripcion,
            materia,
            duracion,
            url_stream
        });

        await newClase.save();
        
        tutor.clases_impartidas.push(newClase._id);
        await tutor.save();

        res.status(201).json({ message: 'Clase creada exitosamente.', clase: newClase });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear la clase.', error: error.message });
    }
};