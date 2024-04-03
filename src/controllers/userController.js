const e = require('express')
let {
    create,
    update,
    findAll,
    findById,
    deleteById,
    getApiChatsByUserId,
    checkPhone,
    getFriendsByIdAndName
} = require('../repositories/userRepository')

let createMethod = async(req, res) => {
    let data = await create(req.body)
    return res.status(200).json(data)
}

let updateMethod = async(req, res) => {
    let data = await update(req.body)
    return res.status(200).json(data)
}

let findAllMethod = async(req, res) => {
    let datas = await findAll()
    return res.status(200).json(datas)
}

let findByIdMethod = async(req, res) => {
    let data = await findById(req.params.id)
    return res.status(200).json(data)
}

let deleteByIdMethod = async(req, res) => {
    let data = await deleteById(req.params.id)
    return res.status(200).json(data)
}

let getApiChatsByUserIdMethod = async(req, res) => {
    let datas = await getApiChatsByUserId(req.params.id)
    return res.status(200).json(datas)
}

let checkPhoneMethod = async(req, res) => {
    let data = await checkPhone(req.params.phone)
    return res.status(200).json(data)
}

let getFriendsByIdAndNameMethod = async(req, res) => {
    let datas = await getFriendsByIdAndName(req.params.id, req.params.name)
    return res.status(200).json(datas)
}

module.exports = {
    createMethod,
    updateMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    getApiChatsByUserIdMethod,
    checkPhoneMethod,
    getFriendsByIdAndNameMethod
}