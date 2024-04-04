const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
} = require('../controllers/statusChatController');

router.get('/status-chats', findAllMethod)
router.get('/status-chats/:id', findByIdMethod)
router.post('/status-chats', upload, createMethod)
router.delete('/status-chats/:id', deleteByIdMethod)

module.exports = router