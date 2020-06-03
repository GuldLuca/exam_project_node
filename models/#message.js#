const Sequelize = require("sequelize");
const sequelize = require("../util/database");

//Creating new table in database reference "sequelize" - message table with following attributes
const Message = sequelize.define("message", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  from: Sequelize.STRING,
  message: Sequelize.STRING,
  time: {
      type: Sequelize.DATE,
      default: Sequelize.NOW
  }
});

module.exports = Message;
