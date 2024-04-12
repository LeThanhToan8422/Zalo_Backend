const e = require('express')
let {
    create,
    update,
    findAll,
    findById,
    deleteById,
    getApiChatsByUserId,
    getApiGroupChatsByUserId,
    checkPhone,
    getFriendsByIdAndName,
    getFriendsById,
    updateFriendsRelationships,
    updateBlockRelationships,
    checkIsFriendByUserId,
    getFriendsHaveNotJoinGroupByUserId,
    getFriendsHaveNotJoinGroupByUserIdAndName,
    getMembersInGroupByGroupId,
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

let updateRelationshipsMethod = async(req, res) => {
    let result = false
    if(req.body.relationship === "friends"){
        if(await updateFriendsRelationships(req.body.id, req.body.objectId))
            result = await updateFriendsRelationships(req.body.objectId, req.body.id)
    }
    else{
        result = await updateBlockRelationships(req.body.id, req.body.objectId)
    }
    return res.status(200).json(result)
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
    let dataGrups = await getApiGroupChatsByUserId(req.params.id)
    return res.status(200).json([...datas,...dataGrups])
}

let checkPhoneMethod = async(req, res) => {
    let data = await checkPhone(req.params.phone)
    return res.status(200).json(data)
}

let getFriendsByIdAndNameMethod = async(req, res) => {
    let datas = await getFriendsByIdAndName(req.params.id, req.params.name)
    return res.status(200).json(datas)
}

let getFriendsByIdMethod = async(req, res) => {
    let datas = await getFriendsById(req.params.id)
    return res.status(200).json(datas)
}

let checkIsFriendMethod = async(req, res) => {
    let data = await checkIsFriendByUserId(req.params.userId, req.params.friendId)
    return res.status(200).json(data)
}

let getFriendsHaveNotJoinGroupByUserIdMethod = async(req, res) => {
    let datas = await getFriendsHaveNotJoinGroupByUserId(req.params.userId, req.params.groupId)
    return res.status(200).json(datas)
}

let getFriendsHaveNotJoinGroupByUserIdAndNameMethod = async(req, res) => {
    let datas = await getFriendsHaveNotJoinGroupByUserIdAndName(req.params.userId, req.params.groupId, req.params.name)
    return res.status(200).json(datas)
}

let getMembersInGroupByGroupIdMethod = async(req, res) => {
    let datas = await getMembersInGroupByGroupId(req.params.groupId)
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
    getFriendsByIdAndNameMethod,
    getFriendsByIdMethod,
    updateRelationshipsMethod,
    checkIsFriendMethod,
    getFriendsHaveNotJoinGroupByUserIdMethod,
    getFriendsHaveNotJoinGroupByUserIdAndNameMethod,
    getMembersInGroupByGroupIdMethod
}