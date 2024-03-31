let {
    create,
    update,
    findAll,
    findById,
    deleteById,
    login,
    checkPhone
} = require('../repositories/accountRepository')

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

let checkPhoneMethod = async(req, res) => {
    let data = await checkPhone(req.params.phone)
    return res.status(200).json(data)
}


module.exports = {
    createMethod,
    updateMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    loginMethod,
    checkPhoneMethod
}