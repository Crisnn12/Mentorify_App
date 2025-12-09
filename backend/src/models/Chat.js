const mongoose = require('mongoose');

const MensajeSchema = new mongoose.Schema({
    id_remitente: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    id_destinatario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    contenido_mensaje: { 
        type: String, 
        required: true,
        trim: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    leido: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true 
});

MensajeSchema.index({ id_remitente: 1, id_destinatario: 1, timestamp: 1 });

const Mensaje = mongoose.model('Mensaje', MensajeSchema);
module.exports = Mensaje;