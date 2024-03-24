const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("zalo", "admin", "sapassword", {
  host: "zalo.cnkw88ec2q60.ap-southeast-1.rds.amazonaws.com",
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
