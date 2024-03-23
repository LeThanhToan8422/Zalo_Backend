let {
    create,
    findAll,
    findById,
    deleteById,
    getApiChatBetweenUsers
} = require('../repositories/chatRepository')

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

let getApiChatBetweenUsersMethod = async(req, res) => {
    let datas = await getApiChatBetweenUsers(req.params.userId, req.params.idChat)
    return res.status(200).json(datas)
}


module.exports = {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    getApiChatBetweenUsersMethod
}