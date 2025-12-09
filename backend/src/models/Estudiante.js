const mongoose = require('mongoose');
const Usuario = require('./Usuario'); 

const EstudianteSchema = new mongoose.Schema({
    carrera: { 
        type: String, 
        default: 'General' 
    },
    suscripcion_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Suscripcion', 
        default: null 
    },
    clases_vistas: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Clase' 
    }],
    tutores_seguidos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tutor' 
    }]
});


module.exports = Usuario.discriminator('Estudiante', EstudianteSchema);