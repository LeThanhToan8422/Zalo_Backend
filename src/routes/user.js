const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createMethod,
    updateMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    getApiChatsByUserIdMethod,
} = require('../controllers/userController')

router.get('/users', findAllMethod)
router.get('/users/:id', findByIdMethod)
router.post('/users', upload, createMethod)
router.put('/users', upload, updateMethod)
router.delete('/users/:id', deleteByIdMethod)
router.get('/users/get-chats-by-id/:id', getApiChatsByUserIdMethod)

module.exports = router