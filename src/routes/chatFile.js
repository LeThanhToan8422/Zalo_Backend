const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
} = require('../controllers/chatController');

router.get('/chat-files', findAllMethod)
router.get('/chat-files/:id', findByIdMethod)
router.post('/chat-files', upload, createMethod)
router.delete('/chat-files/:id', deleteByIdMethod)

module.exports = router