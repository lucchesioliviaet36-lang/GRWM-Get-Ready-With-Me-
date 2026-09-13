const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carpetaUploads = path.join(
  __dirname,
  "../uploads/productos"
);

if (!fs.existsSync(carpetaUploads)) {
  fs.mkdirSync(carpetaUploads, {
    recursive: true
  });
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, carpetaUploads);
  },

  filename: (req, file, cb) => {

    const nombreArchivo =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, nombreArchivo);
  }

});

const fileFilter = (req, file, cb) => {

  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!tiposPermitidos.includes(file.mimetype)) {
    return cb(
      new Error("Solo se permiten imágenes JPG, PNG o WEBP"), false
    );
  }

  cb(null, true);
};

const uploadProducto = multer({
  storage, fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = uploadProducto;