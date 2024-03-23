const { QueryTypes } = require('sequelize')
let db = require('../models/index')
let { sequelize, Op } = require('../models/index')

let create = async(data) => {
    try {
        await sequelize.query(`INSERT INTO Chats (message, dateTimeSend, sender, receiver)
        VALUES (:message, :dateTimeSend, :sender, :receiver)`, {
            replacements :{
                message : data.message,
                dateTimeSend : new Date(),
                sender : data.sender,
                receiver : data.receiver
            },
            type : QueryTypes.INSERT
        })
        return true
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let findAll = async() => {
    try {
        let datas = await db.Chat.findAll({
            attributes : ['id', 'message', 'dateTimeSend', 'sender', 'receiver']
        })
        return datas
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let findById = async(id) => {
    try {
        let data = await db.Chat.findOne({
            attributes : ['id', 'message', 'dateTimeSend', 'sender', 'receiver'],
            where : {
                id : id
            }
        })
        return data.dataValues
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let deleteById = async(id) => {
    try {
        await db.Chat.destroy({
            where : {
                id : id
            }
        })
        return true
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let getApiChatBetweenUsers = (userId, idChat) => {
    try {
        let datas = sequelize.query(`SELECT * FROM Chats WHERE sender = :sender and receiver = :receiver OR sender = :receiver AND receiver = :sender ORDER BY dateTimeSend ASC`, {
            replacements : {
                sender : userId,
                receiver : idChat
            },
            type : QueryTypes.SELECT
        })
        return datas
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

module.exports = {
    create,
    findAll,
    findById,
    deleteById,
    getApiChatBetweenUsers
}