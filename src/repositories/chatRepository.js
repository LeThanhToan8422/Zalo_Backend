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
          dateTimeSend: new Date(),
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

let getApiChatBetweenUsers = (userId, idChat) => {
  try {
    let datas = sequelize.query(
      `SELECT * FROM Chats AS c
        WHERE (c.sender = :sender AND c.receiver = :receiver OR c.sender = :receiver AND c.receiver = :sender)
        AND c.dateTimeSend NOT IN (
            SELECT c.dateTimeSend FROM Chats AS c 
            INNER JOIN Status_Chat AS stc ON c.id = stc.chat
            WHERE (c.sender = :sender AND c.receiver = :receiver OR c.sender = :receiver AND c.receiver = :sender)
            AND if(stc.implementer = :id, 1, 0) OR stc.status = 'recalls'
        )
        UNION ALL 
        SELECT * FROM Chat_Files AS cf 
        WHERE (cf.sender = :sender AND cf.receiver = :receiver OR cf.sender = :receiver AND cf.receiver = :sender)
        AND cf.dateTimeSend NOT IN (
            SELECT cf.dateTimeSend FROM Chat_Files AS cf 
            INNER JOIN Status_Chat_File AS stcf ON cf.id = stcf.chat_file
            WHERE (cf.sender = :sender AND cf.receiver = :receiver OR cf.sender = :receiver AND cf.receiver = :sender)
            AND if(stcf.implementer = :id, 1, 0) OR stcf.status = 'recalls'
            
        )
        ORDER BY dateTimeSend ASC
        `,
      {
        replacements: {
          sender: userId,
          receiver: idChat,
          id : userId
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
};
