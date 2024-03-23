let {
    createOrUpdate,
    findAll,
    findById,
    deleteById,
    login
} = require('../repositories/accountRepository')

let createOrUpdateMethod = async(req, res) => {
    let data = await createOrUpdate(req.body)
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

let loginMethod = async(req, res) => {
    let data = await login(req.body.phone, req.body.password)
    return res.status(200).json(data)
}


module.exports = {
    createOrUpdateMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    loginMethod
}