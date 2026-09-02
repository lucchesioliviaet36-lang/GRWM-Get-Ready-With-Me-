const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('GRWM', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

module.exports = { sequelize };