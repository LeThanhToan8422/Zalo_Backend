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
    updateImageAvatarMethod,
    updateImageBackgroundMethod
} = require('../controllers/userController')

router.get('/users', findAllMethod)
router.get('/users/:id', findByIdMethod)
router.post('/users', upload, createMethod)
router.put('/users', upload, updateMethod)
router.delete('/users/:id', deleteByIdMethod)
router.get('/users/get-chats-by-id/:id', getApiChatsByUserIdMethod)
router.get('/users/phone/:phone', checkPhoneMethod)
router.get('/users/friends/:id/:name', getFriendsByIdAndNameMethod)
router.get('/users/friends/:id/', getApiChatsByUserIdMethod)
router.put('/users/avatar', upload, updateImageAvatarMethod)
router.put('/users/background', upload, updateImageBackgroundMethod)

module.exports = router