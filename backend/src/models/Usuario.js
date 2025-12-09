const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true,
        trim: true
    },
    correo: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        trim: true
    },
    contrasena: { 
        type: String, 
        required: true 
    },
    fecha_registro: { 
        type: Date, 
        default: Date.now 
    },
    rol: { 
        type: String, 
        required: true, 
        enum: ['Estudiante', 'Tutor'] 
    }
}, { 
    discriminatorKey: 'rol', 
    collection: 'usuarios', 
    timestamps: true 
});

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);