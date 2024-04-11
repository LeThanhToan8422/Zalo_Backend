const { QueryTypes } = require("sequelize");
let db = require("../models/index");
let { sequelize, Op } = require("../models/index");

let create = async (data) => {
  try {
    await sequelize.query(
      `INSERT INTO Chats (message, dateTimeSend, sender, receiver)
        VALUES (:message, :dateTimeSend, :sender, :receiver)`,
      {
        replacements: {
          message: data.message,
          dateTimeSend: data.dateTimeSend,
          sender: data.sender,
          receiver: data.receiver,
        },
        type: QueryTypes.INSERT,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

let findAll = async () => {
  try {
    let datas = await db.Chat.findAll({
      attributes: ["id", "message", "dateTimeSend", "sender", "receiver"],
    });
    return datas;
  } catch (error) {
    return null;
  }
};

let findById = async (id) => {
  try {
    let data = await db.Chat.findOne({
      attributes: ["id", "message", "dateTimeSend", "sender", "receiver"],
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
    await db.Chat.destroy({
      where: {
        id: id,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

let getApiChatBetweenUsers = (userId, idChat, page) => {
  try {
    let datas = sequelize.query(
      `SELECT *, IF(FIND_IN_SET(c.id, (SELECT GROUP_CONCAT(st.chat SEPARATOR ',') FROM Status_Chat AS st WHERE st.status = 'recalls')) > 0, TRUE, FALSE) AS isRecalls FROM Chats AS c
        WHERE (c.sender = :sender AND c.receiver = :receiver OR c.sender = :receiver AND c.receiver = :sender)
        AND c.dateTimeSend NOT IN (
            SELECT c.dateTimeSend FROM Chats AS c 
            INNER JOIN Status_Chat AS stc ON c.id = stc.chat
            WHERE (c.sender = :sender AND c.receiver = :receiver OR c.sender = :receiver AND c.receiver = :sender)
            AND if(stc.implementer = :sender, 1, 0) AND stc.status = 'delete'
        ) AND c.id > (SELECT MAX(id) - (:page * 10) FROM Chats as c WHERE (c.sender = :sender AND c.receiver = :receiver OR c.sender = :receiver AND c.receiver = :sender))
        ORDER BY dateTimeSend ASC
        `,
      {
        replacements: {
          sender: userId,
          receiver: idChat,
          page : Number(page)
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

let getApiChatBetweenUsersForDelete = (userId, idChat) => {
  try {
    let datas = sequelize.query(
      `SELECT c.id FROM Chats AS c
      WHERE (c.sender = :sender AND c.receiver = :receiver OR c.sender = :receiver AND c.receiver = :sender)
      AND c.dateTimeSend NOT IN (
          SELECT c.dateTimeSend FROM Chats AS c 
          INNER JOIN Status_Chat AS stc ON c.id = stc.chat
          WHERE (c.sender = :sender AND c.receiver = :receiver OR c.sender = :receiver AND c.receiver = :sender)
          AND if(stc.implementer = :sender, 1, 0) OR stc.status = 'recalls'
      )
      ORDER BY dateTimeSend ASC`,
      {
        replacements: {
          sender: userId,
          receiver: idChat,
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

module.exports = {
  create,
  findAll,
  findById,
  deleteById,
  getApiChatBetweenUsers,
  getApiChatBetweenUsersForDelete
};
