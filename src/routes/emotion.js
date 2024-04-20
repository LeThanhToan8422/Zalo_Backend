const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    getEmojisByChatMethod
} = require('../controllers/emotionController');

router.get('/emotions', findAllMethod)
router.get('/emotions/:id', findByIdMethod)
router.post('/emotions', upload, createMethod)
router.delete('/emotions/:id', deleteByIdMethod)
router.get('/emotions/chat/:chat', getEmojisByChatMethod)

module.exports = router