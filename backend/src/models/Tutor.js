const mongoose = require('mongoose');
const Usuario = require('./Usuario');

const TutorSchema = new mongoose.Schema({
    especialidad: { 
        type: String, 
        required: true 
    },
    biografia: { 
        type: String, 
        default: '' 
    },
    foto_perfil: { 
        type: String,
        default: 'https://placehold.co/100x100/A0A0FF/white?text=PF'
    },
    clases_impartidas: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Clase' 
    }],
    rating_promedio: {
        type: Number,
        default: 0
    }
});

module.exports = Usuario.discriminator('Tutor', TutorSchema);