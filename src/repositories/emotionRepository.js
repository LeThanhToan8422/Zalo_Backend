const { QueryTypes } = require('sequelize')
let db = require('../models/index')
let { sequelize, Op } = require('../models/index')

let create = async(data) => {
    try {
        await sequelize.query(`INSERT INTO Emotions (type, implementer, chat)
        VALUES (:type, :implementer, :chat)`, {
            replacements :{
                type : data.type,
                implementer : data.implementer,
                chat : data.chat
            },
            type : QueryTypes.INSERT
        })
        return data.chat
    } catch (error) {
        console.log(error);
        return false
    }
}

let findAll = async() => {
    try {
        let datas = await db.Emotion.findAll({
            attributes : ['id', 'type', 'implementer', 'chat']
        })
        return datas
    } catch (error) {
        return null
    }
}

let findById = async(id) => {
    try {
        let data = await db.Emotion.findOne({
            attributes : ['id', 'type', 'implementer', 'chat'],
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
        await db.Emotion.destroy({
            where : {
                id : id
            }
        })
        return true
    } catch (error) {
        return false
    }
}

let getEmojisByChat = async(chat) => {
    try {
        let datas = await sequelize.query(`SELECT u.id, u.name, u.image, e.type, COUNT(*) AS quantities FROM Users AS u INNER JOIN Emotions AS e ON u.id = e.implementer
        WHERE e.chat = :chat
        GROUP BY u.id, e.type`, {
            replacements :{
                chat : chat
            },
            type : QueryTypes.SELECT
        })
        return datas
    } catch (error) {
        return false
    }
}

module.exports = {
    create,
    findAll,
    findById,
    deleteById,
    getEmojisByChat
}