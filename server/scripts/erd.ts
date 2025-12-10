const path = require('path');

const connectPath = path.join(__dirname, 'db', 'connect');
const modelsPath = path.join(__dirname, 'model', 'index');

const connect = require(connectPath);
require(modelsPath);

module.exports = connect.sequelize || connect;