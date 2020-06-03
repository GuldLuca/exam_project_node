const Sequelize = require("sequelize");
const sequelize = require("../util/database");

//Creating new table in database reference "sequelize" - user table with following attributes
const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: Sequelize.STRING
});

module.exports = User;
