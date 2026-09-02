const express = require("express");
const { sequelize } = require('./config/db.js');
require('./models/index.js'); 
const userRoutes = require('./routes/userRoutes.js');
const hobbyRoutes = require('./routes/hobbyRoutes.js');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({
        message: "El server funciona correctamente"
    });
});