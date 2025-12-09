const mongoose = require('mongoose');

const ClaseSchema = new mongoose.Schema({
    tutor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tutor', 
        required: true 
    },
    titulo: { 
        type: String, 
        required: true, 
        trim: true 
    },
    descripcion: { 
        type: String, 
        required: true 
    },
    materia: { 
        type: String, 
        required: true 
    },
    url_video: { 
        type: String, 
        required: true 
    },
    url_portada: { 
        type: String, 
        default: 'placeholder_url' 
    },
    duracion_segundos: { 
        type: Number, 
        default: 0 
    },
    vistas: {
        type: Number,
        default: 0
    },
    fecha_hora: { 
        type: Date, 
        default: Date.now 
    },
    es_vivo: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

const Clase = mongoose.model('Clase', ClaseSchema);
module.exports = Clase;