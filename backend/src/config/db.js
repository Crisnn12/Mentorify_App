const mongoose = require('mongoose');
const DB_URL = "mongodb+srv://emixia:sunnychu22@clustermentorify.ruyzg4a.mongodb.net/MentorifyDB?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        if (!DB_URL) {
            throw new Error("DB_URL no está definida.");
        }
        await mongoose.connect(DB_URL);
        console.log('Conexión a MongoDB establecida con éxito.');
    } catch (error) {
        console.error('ERROR CRÍTICO DE CONEXIÓN A MONGODB:', error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;
