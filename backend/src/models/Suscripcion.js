const mongoose = require('mongoose');

const SuscripcionSchema = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Estudiante', 
        required: true 
    },
    costo: { 
        type: Number, 
        required: true 
    },
    fecha_inicio: { 
        type: Date, 
        default: Date.now 
    },
    fecha_expiracion: { 
        type: Date, 
        required: true 
    },
    activa: { 
        type: Boolean, 
        default: false 
    },
    pagado: {
        type: Boolean,
        default: false
    }
});


const Suscripcion = mongoose.model('Suscripcion', SuscripcionSchema);
module.exports = Suscripcion;