const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    updateByIdMethod,
    updateBySenderAndReceiverMethod,
    updateBySenderAndGroupChatMethod
} = require('../controllers/waitMessageController');

router.post('/wait-message/update/:id', upload, updateByIdMethod)
router.post('/wait-message/update/:sender/:receiver', upload, updateBySenderAndReceiverMethod)
router.post('/wait-message/update/:sender/Group/:groupChat', upload, updateBySenderAndGroupChatMethod)

module.exports = router