const { QueryTypes } = require('sequelize')
let db = require('../models/index')
let { sequelize, Op } = require('../models/index')

let create = async(data) => {
    console.log(data);
    try {
        await sequelize.query(`INSERT INTO Status_Chat (status, implementer, chat)
        VALUES (:status, :implementer, :chat)`, {
            replacements :{
                status : data.status,
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
        let datas = await db.StatusChat.findAll({
            attributes : ['id', 'type', 'status', 'implementer', 'chat']
        })
        return datas
    } catch (error) {
        return null
    }
}

let findById = async(id) => {
    try {
        let data = await db.StatusChat.findOne({
            attributes : ['id', 'type', 'status', 'implementer', 'chat'],
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
        await db.StatusChat.destroy({
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