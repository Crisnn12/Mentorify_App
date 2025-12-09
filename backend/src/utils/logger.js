const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../server.log');

const log = (category, message) => {
    const timestamp = new Date().toISOString(); 
    const logLine = `[${timestamp}] [${category}] ${message}\n`;

    fs.appendFile(logFilePath, logLine, (err) => {
        if (err) {
            console.error('ERROR CRÍTICO: No se pudo escribir en el archivo de logs.', err);
        }
    });

    console.log(logLine.trim());
};

module.exports = { log };