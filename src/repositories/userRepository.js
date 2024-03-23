const { QueryTypes } = require('sequelize')
let db = require('../models/index')
let { sequelize, Op } = require('../models/index')

let create = async(data) => {
    try {
        await db.User.create(data)
        return true
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let update = async(data) => {
    try {
        await sequelize.query(`UPDATE users
        SET name = :name, gender = :gender, dob = :dob
        WHERE id = :id`, {
            replacements : {
                id : data.id,
                name : data.name,
                gender : data.gender,
                dob : data.dob
            },
            type : QueryTypes.UPDATE
        })
        return true
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let findAll = async() => {
    try {
        let datas = await db.User.findAll({
            attributes : ['id', 'name', 'gender', 'dob', 'email', 'image', 'background', 'friends']
        })
        return datas
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let findById = async(id) => {
    try {
        let data = await sequelize.query(`SELECT u.id, u.name, u.gender, u.dob, a.phone, u.image, u.background FROM users AS u INNER JOIN accounts AS a ON u.id = a.user WHERE u.id = :id`,{
            replacements : {
                id : id
            },
            type : QueryTypes.SELECT
        })
        return data[0]
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let deleteById = async(id) => {
    try {
        await db.User.destroy({
            where : {
                id : id
            }
        })
        return true
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}

let getApiChatsByUserId = (id) => {
    try {
        let datas = sequelize.query(`SELECT u.id, u.name, u.gender, u.dob, u.email, u.image, u.background, c.message, c.dateTimeSend, c.receiver, c.sender
        FROM users AS u INNER JOIN chats as c ON (c.sender = u.id AND c.receiver = :id) OR (c.sender = :id AND c.receiver = u.id)
        WHERE u.id <> :id AND c.id = ( SELECT MAX(id) FROM chats WHERE (sender = u.id AND receiver = :id) OR (sender = :id AND receiver = u.id))`, {
            replacements : {
                id : id
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
    update,
    findAll,
    findById,
    deleteById,
    getApiChatsByUserId,
}