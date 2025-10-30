const Clase = require('../models/Clase');
const Tutor = require('../models/Tutor');

exports.getClasses = async (req, res) => {
    try {
        const classes = await Clase.find({})
            .populate('tutor_id', 'nombre especialidad') 
            .sort({ fecha_hora: -1 }); 
        
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las clases.' });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { titulo, materia, fecha_hora, tutor_id } = req.body;
        const tutor = await Tutor.findById(tutor_id);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor no encontrado.' });
        }
        const newClass = await Clase.crearClase(req.body); 
        tutor.clases_impartidas.push(newClass._id);
        await tutor.save();

        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la clase.', error: error.message });
    }
};