const { QueryTypes } = require("sequelize");
let db = require("../models/index");
let { sequelize, Op } = require("../models/index");

let create = async (data) => {
  try {
    const [chatID, metadata] = await sequelize.query(
      `INSERT INTO Chats (message, dateTimeSend, sender, receiver, groupChat, chatReply)
        VALUES (:message, :dateTimeSend, :sender, :receiver, :groupChat, :chatReply)`,
      {
        replacements: {
          message: data.message,
          dateTimeSend: data.dateTimeSend,
          sender: data.sender,
          receiver: data.receiver ? data.receiver : null,
          groupChat : data.groupChat ? data.groupChat : null,
          chatReply : data.chatReply ? data.chatReply : null,
        },
        type: QueryTypes.INSERT,
      }
    );
    return chatID;
  } catch (error) {
    return null;
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

let getApiChatBetweenUsers = async(userId, idChat, page) => {
  try {
    let datas = await sequelize.query(
      `
      SELECT c.*, 
            IF(FIND_IN_SET(c.id, (SELECT GROUP_CONCAT(st.chat SEPARATOR ',') FROM Status_Chat AS st WHERE st.status = 'recalls')) > 0, TRUE, FALSE) AS isRecalls, GROUP_CONCAT(e.type) AS emojis, COUNT(*) AS quantities, u.name
      FROM Chats AS c
      LEFT JOIN Deleted_Chats AS dc ON dc.implementer = :sender
      LEFT JOIN Emotions AS e ON c.id = e.chat
      INNER JOIN Users AS u ON u.id = c.sender
      WHERE ((c.sender = :sender AND c.receiver = :receiver) OR (c.sender = :receiver AND c.receiver = :sender))
      AND c.dateTimeSend NOT IN (
          SELECT c1.dateTimeSend 
          FROM Chats AS c1
          INNER JOIN Status_Chat AS stc ON c1.id = stc.chat
          WHERE ((c1.sender = :sender AND c1.receiver = :receiver) OR (c1.sender = :receiver AND c1.receiver = :sender))
          AND IF(stc.implementer = :sender, 1, 0) AND stc.status = 'delete'
      ) 
      AND c.id IN (
          SELECT c2.id 
          FROM (
              SELECT id 
              FROM Chats AS c
              WHERE ((c.sender = :sender AND c.receiver = :receiver) OR (c.sender = :receiver AND c.receiver = :sender))
              ORDER BY dateTimeSend DESC 
              LIMIT 100
          ) AS c2
      )
      AND (dc.dateTimeSend IS NULL OR c.dateTimeSend > dc.dateTimeSend)
      GROUP BY c.id
      ORDER BY c.dateTimeSend ASC;
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

let getApiChatBetweenUsersForDelete = async(userId, idChat) => {
  try {
    let datas = await sequelize.query(
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
