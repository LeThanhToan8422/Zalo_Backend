const { QueryTypes } = require("sequelize");
let db = require("../models/index");
let { sequelize, Op } = require("../models/index");


let create = async (data) => {
  try {
    await sequelize.query(
      `INSERT INTO Accounts (phone,password,user) VALUES (:phone,:password,:user)`,
      {
        replacements: {
          phone: data.phone,
          password: data.password,
          user: data.user,
        },
        type: QueryTypes.INSERT,
      }
    );
    return true;
  } catch (error) {
    return null;
  }
};

let update = async (data) => {
    try {
      await sequelize.query(
        `UPDATE Accounts
          SET phone = :phone, password = :password
          WHERE id = :id`,
        {
          replacements: {
            id: data.id,
            phone: data.phone,
            password: data.password,
          },
          type: QueryTypes.UPDATE,
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  };

let findAll = async () => {
  try {
    let datas = await db.Account.findAll({
      attributes: ["id", "phone", "password", "user"],
    });
    return datas;
  } catch (error) {
    return null;
  }
};

let findById = async (id) => {
  try {
    let data = await db.Account.findOne({
      attributes: ["id", "phone", "password", "user"],
      where: {
        id: id,
      },
    });
    return data.dataValues;
  } catch (error) {
    return null;
  }
};

let deleteById = async (id) => {
  try {
    await db.Account.destroy({
      where: {
        id: id,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

let login = async (phone, password) => {
  try {
    let data = await sequelize.query(
      "SELECT u.id, u.name, u.gender, u.dob, u.email, a.phone, u.image, u.background FROM Accounts AS a INNER JOIN Users AS u ON a.`user` = u.id WHERE a.phone = :phone AND a.`password` = :password",
      {
        replacements: {
          phone: phone,
          password: password,
        },
        type: QueryTypes.SELECT,
      }
    );
    return data[0];
  } catch (error) {
    return null;
  }
};

let checkPhone = async (phone) => {
  try {
    let data = await db.Account.findOne({
      attributes: ["id", "phone", "password", "user"],
      where: {
        phone: phone,
      },
    });
    return data.dataValues;
  } catch (error) {
    return null;
  }
};

module.exports = {
  create,
  update,
  findAll,
  findById,
  deleteById,
  login,
  checkPhone,
};
