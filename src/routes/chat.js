const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    getApiChatBetweenUsersMethod
} = require('../controllers/chatController');

router.get('/chats', findAllMethod)
router.get('/chats/:id', findByIdMethod)
router.post('/chats', upload, createMethod)
router.delete('/chats/:id', deleteByIdMethod)
router.get('/chats/content-chats-between-users/:userId-and-:idChat/:page', getApiChatBetweenUsersMethod)

module.exports = router