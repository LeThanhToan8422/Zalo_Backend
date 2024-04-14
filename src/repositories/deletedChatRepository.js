const { QueryTypes } = require('sequelize')
let db = require('../models/index')
let { sequelize, Op } = require('../models/index')

let create = async(data) => {
    try {
        await sequelize.query(`INSERT INTO Deleted_Chats (dateTimeSend, implementer, chat, groupChat)
        VALUES (:dateTimeSend, :implementer, :chat, :groupChat)`, {
            replacements :{
                dateTimeSend : data.dateTimeSend,
                implementer : data.implementer,
                chat : data.chat ? data.chat : null,
                groupChat : data.groupChat ? data.groupChat : null,
            },
            type : QueryTypes.INSERT
        })
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

let findAll = async() => {
    try {
        let datas = await db.DeletedChat.findAll({
            attributes : ['id', 'dateTimeSend', 'implementer', 'chat', 'groupChat']
        })
        return datas
    } catch (error) {
        return null
    }
}

let findById = async(id) => {
    try {
        let data = await db.DeletedChat.findOne({
            attributes : ['id', 'dateTimeSend', 'implementer', 'chat', 'groupChat'],
            where : {
                id : id
            }
        })
        return data.dataValues
    } catch (error) {
        return null
    }
}

let deleteById = async(id) => {
    try {
        await db.DeletedChat.destroy({
            where : {
                id : id
            }
        })
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    create,
    findAll,
    findById,
    deleteById,
}