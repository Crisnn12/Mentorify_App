const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true, 
        unique: true 
    },
    color_hex: { 
        type: String, 
        default: '#FFFFFF' 
    },
    icono: { 
        type: String, 
        default: 'help' 
    }, 
});

const Materia = mongoose.model('Materia', MateriaSchema);
module.exports = Materia;