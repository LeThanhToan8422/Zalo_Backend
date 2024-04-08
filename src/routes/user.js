const router = require('express').Router()
const upload = require('../middleware/upload')
let {
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
    checkIsFriendMethod
} = require('../controllers/userController')

router.get('/users', findAllMethod)
router.get('/users/:id', findByIdMethod)
router.post('/users', upload, createMethod)
router.post('/users/relationships', upload, updateRelationshipsMethod)
router.put('/users', upload, updateMethod)
router.delete('/users/:id', deleteByIdMethod)
router.get('/users/get-chats-by-id/:id', getApiChatsByUserIdMethod)
router.get('/users/phone/:phone', checkPhoneMethod)
router.get('/users/friends/:id/:name', getFriendsByIdAndNameMethod)
router.get('/users/friends/:id', getFriendsByIdMethod)
router.get('/users/friends/:id/', getApiChatsByUserIdMethod)
router.get('/users/check-is-friend/:userId/:friendId', checkIsFriendMethod)

module.exports = router