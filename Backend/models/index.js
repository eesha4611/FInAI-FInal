const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  logging: false
});

const ReceiptScan = require('./ReceiptScan')(sequelize, require('sequelize').DataTypes);

const db = {
  sequelize,
  Sequelize,
  ReceiptScan
};

module.exports = db;
