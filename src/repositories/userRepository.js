const { QueryTypes } = require("sequelize");
let db = require("../models/index");
let { sequelize, Op } = require("../models/index");

let create = async (data) => {
  try {
    await sequelize.query(
      `INSERT INTO Users (name,gender,dob,phone, image, background) VALUES (:name,:gender,:dob,:phone,:image,:background)`,
      {
        replacements: {
          name: data.name,
          gender: data.gender,
          dob: data.dob,
          phone: data.phone,
          image: data.image
            ? data.image
            : "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/toan.jfif",
          background: data.background
            ? data.background
            : "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/backgroud.jpg",
        },
        type: QueryTypes.INSERT,
      }
    );
    return await checkPhone(data.phone);
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

let updateImageAvatar = async (data) => {
  try {
    await sequelize.query(
      `UPDATE Users
        SET image = :image
        WHERE id = :id`,
      {
        replacements: {
          id: data.id,
          image: data.image,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return await findById(data.id);
  } catch (error) {
    return null;
  }
};

let updateImageBackground = async (data) => {
  try {
    await sequelize.query(
      `UPDATE Users
        SET background = :background
        WHERE id = :id`,
      {
        replacements: {
          id: data.id,
          background: data.background,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return await findById(data.id);
  } catch (error) {
    return null;
  }
};

let findAll = async () => {
  try {
    let datas = await sequelize.query("SELECT * FROM Users", {type : QueryTypes.SELECT})
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

let getApiChatsByUserId = async (id) => {
  try {
    let datas = await sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, u.phone, u.image, u.background, c.message, c.dateTimeSend, c.receiver, c.sender
      FROM Users AS u INNER JOIN Chats as c ON (c.sender = u.id AND c.receiver = :id) OR (c.sender = :id AND c.receiver = u.id)
      WHERE c.id = ( 
        SELECT id FROM Chats AS c 
        WHERE (sender = u.id AND receiver = :id) OR (sender = :id AND receiver = u.id) AND c.id NOT IN (
          SELECT c.id FROM Chats AS c 
          INNER JOIN Status_Chat AS st ON c.id = st.chat
          WHERE (sender = u.id AND receiver = :id) OR (sender = :id AND receiver = u.id)
        )
        ORDER BY c.dateTimeSend DESC
        LIMIT 1
      )`,
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

let checkPhone = async (phone) => {
  try {
    let data = await sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, u.phone, u.image, u.background FROM Users AS u WHERE u.phone = :phone`,
      {
        replacements: {
          phone: phone,
        },
        type: QueryTypes.SELECT,
      }
    );
    return data[0];
  } catch (error) {
    return null;
  }
};

let getFriendsByIdAndName = async (id, name) => {
  try {
    let datas = await sequelize.query(
      `SELECT u.*
      FROM Users u
      JOIN (
        SELECT JSON_UNQUOTE(friend_id) AS friend_id
        FROM Users
        CROSS JOIN JSON_TABLE(
          relationships,
          '$.friends[*]' COLUMNS (
            friend_id VARCHAR(255) PATH '$'
          )
        ) AS friends
        WHERE id = :id
      ) f ON u.id = CAST(f.friend_id AS INT)
      WHERE u.name LIKE :name`,
      {
        replacements: {
          id : Number(id),
          name: `%${name}%`,
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

let getFriendsById = async (id) => {
  try {
    let datas = await sequelize.query(
      `SELECT u.*
      FROM Users u
      JOIN (
        SELECT JSON_UNQUOTE(friend_id) AS friend_id
        FROM Users
        CROSS JOIN JSON_TABLE(
          relationships,
          '$.friends[*]' COLUMNS (
            friend_id VARCHAR(255) PATH '$'
          )
        ) AS friends
        WHERE id = :id
      ) f ON u.id = CAST(f.friend_id AS INT)`,
      {
        replacements: {
          id : Number(id),
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

let getApiChatsFinalByUserIdAndChatId = async(id, chatId) => {
  try {
    let datas = await sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, u.phone, u.image, u.background, c.message, c.dateTimeSend, c.receiver, c.sender
      FROM Users AS u 
      INNER JOIN Chats as c ON (c.sender = u.id AND c.receiver = :sender) OR (c.sender = :sender AND c.receiver = u.id)
      WHERE c.id = ( 
        SELECT id FROM Chats AS c 
        WHERE (c.sender = :receiver AND c.receiver = :sender) OR (c.sender = :sender AND c.receiver = :receiver) AND c.id NOT IN (
          SELECT c.id FROM Chats AS c 
          INNER JOIN Status_Chat AS st ON c.id = st.chat
          WHERE (c.sender = :receiver AND c.receiver = :sender) OR (c.sender = :sender AND c.receiver = :receiver)
        )
        ORDER BY c.dateTimeSend DESC
        LIMIT 1
      )`,
      {
        replacements: {
          sender: id,
          receiver: chatId
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas[0];
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
  checkPhone,
  getFriendsByIdAndName,
  updateImageAvatar,
  updateImageBackground,
  getFriendsById,
  getApiChatsFinalByUserIdAndChatId
};
