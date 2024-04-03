const e = require('express')
let {
    create,
    update,
    findAll,
    findById,
    deleteById,
    getApiChatsByUserId,
    checkPhone,
    getFriendsByIdAndName,
    updateImageAvatar,
    updateImageBackground,
} = require('../repositories/userRepository')
const { uploadFile } = require('../service/file.service')

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

let updateImageAvatarMethod = async(req, res) => {
    let avatarUrl = await uploadFile(req.body.file)
    let data = await updateImageAvatar({
        id : req.body.id,
        image : avatarUrl,
    })
    return res.status(200).json(data)
}

let updateImageBackgroundMethod = async(req, res) => {
    let backgroundUrl = await uploadFile(req.body.file)
    let data = await updateImageBackground({
        id : req.body.id,
        background : backgroundUrl,
    })
    return res.status(200).json(data)
}

module.exports = {
    createMethod,
    updateMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    getApiChatsByUserIdMethod,
    checkPhoneMethod,
    getFriendsByIdAndNameMethod,
    updateImageAvatarMethod,
    updateImageBackgroundMethod
}