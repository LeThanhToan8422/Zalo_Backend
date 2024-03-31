const { QueryTypes } = require("sequelize");
let db = require("../models/index");
let { sequelize, Op } = require("../models/index");

let create = async (data) => {
  try {
    await sequelize.query(
      `INSERT INTO Users (name,gender,dob,email, image, background) VALUES (:name,:gender,:dob,:email,:image,:background)`,
      {
        replacements: {
          name: data.name,
          gender: data.gender,
          dob: data.dob,
          email: data.email,
          image: data.image ? data.image : "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/toan.jfif",
          background: data.background ? data.background : "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/backgroud.jpg",
        },
        type: QueryTypes.INSERT,
      }
    );
    return await checkEmail(data.email);
  } catch (error) {
    return null;
  }
};

let update = async (data) => {
  try {
    await sequelize.query(
      `UPDATE Users
        SET name = :name, gender = :gender, dob = :dob
        WHERE id = :id`,
      {
        replacements: {
          id: data.id,
          name: data.name,
          gender: data.gender,
          dob: data.dob,
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
    let datas = await db.User.findAll({
      attributes: [
        "id",
        "name",
        "gender",
        "dob",
        "email",
        "image",
        "background",
        "friends",
      ],
    });
    return datas;
  } catch (error) {
    return null;
  }
};

let findById = async (id) => {
  try {
    let data = await sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, a.phone, u.image, u.background FROM Users AS u INNER JOIN Accounts AS a ON u.id = a.user WHERE u.id = :id`,
      {
        replacements: {
          id: id,
        },
        type: QueryTypes.SELECT,
      }
    );
    return data[0];
  } catch (error) {
    return null;
  }
};

let deleteById = async (id) => {
  try {
    await db.User.destroy({
      where: {
        id: id,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

let getApiChatsByUserId = (id) => {
  try {
    let datas = sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, u.email, u.image, u.background, c.message, c.dateTimeSend, c.receiver, c.sender
        FROM Users AS u INNER JOIN Chats as c ON (c.sender = u.id AND c.receiver = :id) OR (c.sender = :id AND c.receiver = u.id)
        WHERE u.id <> :id AND c.id = ( SELECT MAX(id) FROM Chats WHERE (sender = u.id AND receiver = :id) OR (sender = :id AND receiver = u.id))`,
      {
        replacements: {
          id: id,
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

let checkEmail = async (email) => {
  try {
    let data = await sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, u.image, u.background FROM Users AS u WHERE u.email = :email`,
      {
        replacements: {
          email: email,
        },
        type: QueryTypes.SELECT,
      }
    );
    return data[0];
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
  getApiChatsByUserId,
  checkEmail,
};
