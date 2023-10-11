const multer = require('multer');

// Configuración para subir archivos multimedia
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.fieldname === 'imagen') {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('Formato de imagen no válido. Solo se permiten JPG y PNG.'));
            }
        } else if (file.fieldname === 'video') {
            if (file.mimetype === 'video/mp4') {
                callback(null, true);
            } else {
                callback(new Error('Formato de video no válido. Solo se permite MP4.'));
            }
        } else {
            callback(new Error('Campo de archivo no reconocido.'));
        }
    },
    limits: {
        fieldSize: 150 * 1024 * 1024, // Limita el tamaño total de todos los archivos a 15 MB
    },
}).fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]);

module.exports = upload;
