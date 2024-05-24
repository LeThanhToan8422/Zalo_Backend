const { QueryTypes } = require("sequelize");
let db = require("../models/index");
let { sequelize, Op } = require("../models/index");

let create = async (data) => {
  try {
    await sequelize.query(
      `INSERT INTO Deleted_Chats (dateTimeSend, implementer, chat, groupChat)
        VALUES (:dateTimeSend, :implementer, :chat, :groupChat)`,
      {
        replacements: {
          dateTimeSend: data.dateTimeSend,
          implementer: data.implementer,
          chat: data.chat ? data.chat : null,
          groupChat: data.groupChat ? data.groupChat : null,
        },
        type: QueryTypes.INSERT,
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

let updateByChat = async (data) => {
  try {
    console.log(data);
    await sequelize.query(
      `UPDATE Deleted_Chats
          SET dateTimeSend = :dateTimeSend
          WHERE implementer = :implementer AND chat = :chat`,
      {
        replacements: {
          dateTimeSend: data.dateTimeSend,
          implementer: data.implementer,
          chat: data.chat ? data.chat : null,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

let updateByGroupChat = async (data) => {
    try {
      await sequelize.query(
        `UPDATE Deleted_Chats
            SET dateTimeSend = :dateTimeSend
            WHERE implementer = :implementer AND groupChat = :groupChat`,
        {
          replacements: {
            dateTimeSend: data.dateTimeSend,
            implementer: data.implementer,
            groupChat: data.groupChat ? data.groupChat : null,
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
    let datas = await db.DeletedChat.findAll({
      attributes: ["id", "dateTimeSend", "implementer", "chat", "groupChat"],
    });
    return datas;
  } catch (error) {
    return null;
  }
};

let findByImplementerAndChat = async (data) => {
    try {
        let datas = await sequelize.query(
          `SELECT * FROM Deleted_Chats WHERE implementer = :implementer AND chat = :chat`,
          {
            replacements: {
              implementer: data.implementer,
              chat: data.chat ? data.chat : null,
            },
            type: QueryTypes.SELECT,
          }
        );
        return datas[0];
      } catch (error) {
        return null;
      }
};

let findByImplementerAndGropChat = async (data) => {
    try {
        let datas = await sequelize.query(
          `SELECT * FROM Deleted_Chats WHERE implementer = :implementer AND groupChat = :groupChat`,
          {
            replacements: {
              implementer: data.implementer,
              groupChat: data.groupChat ? data.groupChat : null,
            },
            type: QueryTypes.SELECT,
          }
        );
        return datas[0];
      } catch (error) {
        return null;
      }
};

let deleteById = async (id) => {
  try {
    await db.DeletedChat.destroy({
      where: {
        id: id,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  create,
  updateByChat,
  updateByGroupChat,
  findAll,
  findByImplementerAndChat,
  findByImplementerAndGropChat,
  deleteById,
};
