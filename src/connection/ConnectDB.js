const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("zalo", "root", "sapassword", {
  host: "localhost",
  dialect: "mariadb",
});

let ConnectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
      } catch (error) {
        console.error("Unable to connect to the database:", error);
      }
}

module.exports = {
    ConnectDB
}
