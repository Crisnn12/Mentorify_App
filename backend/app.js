const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const path = require('path');
const http = require('http'); 
const { Server } = require("socket.io"); 
const { log } = require('./src/utils/logger'); 

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const connectDB = require('./src/config/db'); 
const userRoutes = require('./src/routes/userRoutes'); 
const classRoutes = require('./src/routes/classRoutes'); 
const seedRoutes = require('./src/routes/seedRoutes');

connectDB().then(() => {
    log('INFO', 'Conexión a MongoDB establecida correctamente.');
}).catch(err => {
    log('ERROR', `Fallo conexión a MongoDB: ${err.message}`);
});

const app = express();
const server = http.createServer(app); 

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); 
app.use(express.json()); 

const io = new Server(server, {
    cors: corsOptions,
    path: '/socket.io' 
});

io.on('connection', (socket) => {
    log('DEBUG', `Usuario conectado por socket: ${socket.id}`);
    
    socket.on('joinClass', (claseId) => {
        socket.join(claseId);
        log('INFO', `Socket ${socket.id} se unió a la sala: ${claseId}`);
    });

    socket.on('sendMessage', (data) => {
        log('INFO', `Mensaje enviado en sala ${data.claseId} por usuario: ${data.user}`);
        io.to(data.claseId).emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        log('DEBUG', `Usuario desconectado: ${socket.id}`);
    });
});

app.use('/api/user', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/seed', seedRoutes);

app.get('/', (req, res) => {
    res.send('API de Mentorify funcionando!');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    log('INFO', `Servidor Express/Socket.IO iniciado en el puerto ${PORT}`);
}).on('error', (err) => {
    log('ERROR', `Error al iniciar el servidor: ${err.message}`);
    process.exit(1);
});