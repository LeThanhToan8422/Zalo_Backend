const { QueryTypes } = require('sequelize')
let db = require('../models/index')
let { sequelize, Op } = require('../models/index')

let create = async(data) => {
    try {
        await sequelize.query(`INSERT INTO Chat_Files (url, dateTimeSend, sender, receiver)
        VALUES (:url, :dateTimeSend, :sender, :receiver)`, {
            replacements :{
                url : data.url,
                dateTimeSend : new Date(),
                sender : data.sender,
                receiver : data.receiver
            },
            type : QueryTypes.INSERT
        })
        return true
    } catch (error) {
        return false
    }
}

let findAll = async() => {
    try {
        let datas = await db.ChatFile.findAll({
            attributes : ['id', 'url', 'dateTimeSend', 'sender', 'receiver']
        })
        return datas
    } catch (error) {
        return null
    }
}

let findById = async(id) => {
    try {
        let data = await db.ChatFile.findOne({
            attributes : ['id', 'url', 'dateTimeSend', 'sender', 'receiver'],
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
        await db.ChatFile.destroy({
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