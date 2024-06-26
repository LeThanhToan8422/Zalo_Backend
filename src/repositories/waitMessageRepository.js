const { QueryTypes } = require("sequelize");
let db = require("../models/index");
let { sequelize, Op } = require("../models/index");

let create = async (data) => {
  try {
    await sequelize.query(
      `INSERT INTO Wait_Messages (dateTimeSend, sender, receiver, groupChat)
        VALUES (:dateTimeSend, :sender, :receiver, :groupChat)`,
      {
        replacements: {
          dateTimeSend: data.dateTimeSend,
          sender: data.sender,
          receiver: data.receiver ? data.receiver : null,
          groupChat: data.groupChat ? data.groupChat : null,
        },
        type: QueryTypes.INSERT,
      }
    );
    if(data.groupChat){
      return await findBySenderAndGroupChat(data.sender, data.groupChat);
    }
    else{
      return await findBySenderAndReceiver(data.sender, data.receiver);
    }
  } catch (error) {
    return false;
  }
};

let updateById = async (id, dateTimeSend) => {
  try {
    await sequelize.query(
      `UPDATE Wait_Messages
          SET dateTimeSend = :dateTimeSend
          WHERE id = :id`,
      {
        replacements: {
          id: id,
          dateTimeSend: dateTimeSend
        },
        type: QueryTypes.UPDATE,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

let updateBySenderAndReceiver = async (sender, receiver, dateTimeSend) => {
  try {
    await sequelize.query(
      `UPDATE Wait_Messages
          SET dateTimeSend = :dateTimeSend
          WHERE sender = :sender AND receiver = :receiver`,
      {
        replacements: {
          sender: sender,
          receiver: receiver,
          dateTimeSend: dateTimeSend,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

let updateBySenderAndGroupChat = async (sender, groupChat, dateTimeSend) => {
  try {
    await sequelize.query(
      `UPDATE Wait_Messages
          SET dateTimeSend = :dateTimeSend
          WHERE sender = :sender AND groupChat = :groupChat`,
      {
        replacements: {
          sender: sender,
          groupChat: groupChat,
          dateTimeSend: dateTimeSend,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

let findBySenderAndReceiver = async (sender, receiver) => {
  try {
    let datas = await sequelize.query(
      `SELECT * FROM Wait_Messages WHERE sender = :sender AND receiver = :receiver`,
      {
        replacements: {
          sender : sender,
          receiver : receiver,
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas[0];
  } catch (error) {
    return null;
  }
};

let findBySenderAndGroupChat = async (sender, groupChat) => {
  try {
    let datas = await sequelize.query(
      `SELECT * FROM Wait_Messages WHERE sender = :sender AND groupChat = :groupChat`,
      {
        replacements: {
          sender : sender,
          groupChat : groupChat,
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
  updateById,
  updateBySenderAndReceiver,
  updateBySenderAndGroupChat,
  findBySenderAndReceiver,
  findBySenderAndGroupChat,
};
