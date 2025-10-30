const mongoose = require('mongoose');
const DB_URL = process.env.MONGO_URI; 
const connectDB = async () => {
    try {
        if (!DB_URL) {
            throw new Error("MONGO_URI no está definida en el archivo .env.");
        }
        await mongoose.connect(DB_URL);
        console.log('Conexión a MongoDB establecida con éxito.');
    } catch (error) {
        console.error('Detalles del error:', error.message);
        process.exit(1); 
    }
};
module.exports = connectDB;