const Sequelize = require("sequelize");

//Creating new Sequelize object on database config data
const sequelize = new Sequelize("node-chat", "luca", "transferstorableultimatebrutishly", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
