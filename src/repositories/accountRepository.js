const { QueryTypes } = require('sequelize')
let db = require('../models/index')
let { sequelize, Op } = require('../models/index')

let createOrUpdate = async(data) => {
    try {
        await db.Account.create(data)
        return true
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let findAll = async() => {
    try {
        let datas = await db.Account.findAll({
            attributes : ['id', 'phone', 'password', 'user']
        })
        return datas
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let findById = async(id) => {
    try {
        let data = await db.Account.findOne({
            attributes : ['id', 'phone', 'password', 'user'],
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
        await db.Account.destroy({
            where : {
                id : id
            }
        })
        return true
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let login = async(phone, password) =>{
    try {
        let data = await sequelize.query("SELECT u.id, u.name, u.gender, u.dob, u.email, a.phone, u.image, u.background FROM Accounts AS a INNER JOIN Users AS u ON a.`user` = u.id WHERE a.phone = :phone AND a.`password` = :password", {
            replacements : {
                phone : '0329623380',
                password : '123456789'
            },
            type : QueryTypes.SELECT
        })
        return data[0]
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

module.exports = {
    createOrUpdate,
    findAll,
    findById,
    deleteById,
    login
}