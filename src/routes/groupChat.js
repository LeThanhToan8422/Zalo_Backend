const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    getApiChatBetweenGroupMethod,
} = require('../controllers/groupChatController');

router.get('/group-chats', findAllMethod)
router.get('/group-chats/:id', findByIdMethod)
router.post('/group-chats', upload, createMethod)
router.delete('/group-chats/:id', deleteByIdMethod)
router.get('/group-chats/content-chats-between-group/:groupId/:page', getApiChatBetweenGroupMethod)

module.exports = router