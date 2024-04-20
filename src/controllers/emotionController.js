let {
    create,
    findAll,
    findById,
    deleteById,
    getEmojisByChat
} = require('../repositories/emotionRepository')

let createMethod = async(req, res) => {
    let data = await create(req.body)
    return res.status(200).json(data)
}

let findAllMethod = async(req, res) => {
    let datas = await findAll()
    return res.status(200).json(datas.map(e => e.dataValues))
}

let findByIdMethod = async(req, res) => {
    let data = await findById(req.params.id)
    return res.status(200).json(data)
}

let deleteByIdMethod = async(req, res) => {
    let data = await deleteById(req.params.id)
    return res.status(200).json(data)
}

let getEmojisByChatMethod = async(req, res) => {
    let datas = await getEmojisByChat(req.params.chat)
    return res.status(200).json(datas)
}


module.exports = {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    getEmojisByChatMethod
}