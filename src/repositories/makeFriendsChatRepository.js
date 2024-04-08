const { QueryTypes } = require('sequelize')
let db = require('../models/index')
let { sequelize, Op } = require('../models/index')

let create = async(data) => {
    try {
        await sequelize.query(`INSERT INTO Make_Friends (content, giver, recipient)
        VALUES (:content, :giver, :recipient)`, {
            replacements :{
                content : data.content,
                giver : data.giver,
                recipient : data.recipient
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
        let datas = await db.MakeFriends.findAll({
            attributes : ['id', 'content', 'giver', 'recipient']
        })
        return datas
    } catch (error) {
        return null
    }
}

let findById = async(id) => {
    try {
        let data = await db.MakeFriends.findOne({
            attributes : ['id', 'content', 'giver', 'recipient'],
            where : {
                id : id
            }
        })
        return data.dataValues
    } catch (error) {
        return null
    }
}

let findByRecipient = async(recipient) => {
    try {
        let datas = await sequelize.query("SELECT u.id, u.name, u.image, mf.content, mf.id as makeFriendId FROM Make_Friends AS mf INNER JOIN Users AS u ON u.id = mf.giver WHERE recipient = :recipient", {
            replacements :{
                recipient : recipient
            },
            type : QueryTypes.SELECT
        })
        return datas
    } catch (error) {
        return null
    }
}

let deleteById = async(id) => {
    try {
        await sequelize.query("DELETE FROM Make_Friends WHERE id = :id", {
            replacements :{
                id : id
            },
            type : QueryTypes.DELETE
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
    findByRecipient,
}