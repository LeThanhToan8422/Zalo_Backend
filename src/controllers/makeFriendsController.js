let {
    create,
    findAll,
    findById,
    deleteById,
    findByRecipient,
} = require('../repositories/makeFriendsRepository')

let createMethod = async(req, res) => {
    let data = await create(req.body)
    return res.status(200).json(data)
}

let findAllMethod = async(req, res) => {
    let datas = await findAll()
    return res.status(200).json(datas?.map(e => e.dataValues))
}

let findByIdMethod = async(req, res) => {
    let data = await findById(req.params.id)
    return res.status(200).json(data)
}

let findByRecipientMethod = async(req, res) => {
    let datas = await findByRecipient(req.params.recipient)
    return res.status(200).json(datas)
}

let deleteByIdMethod = async(req, res) => {
    let data = await deleteById(req.params.id)
    return res.status(200).json(data)
}


module.exports = {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    findByRecipientMethod
}