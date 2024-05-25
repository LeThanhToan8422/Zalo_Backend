const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    updateByIdMethod,
    updateBySenderAndReceiverMethod,
    updateBySenderAndGroupChatMethod
} = require('../controllers/waitMessageController');

router.post('/wait-message/update/:id/:dateTimeSend', upload, updateByIdMethod)
router.post('/wait-message/update/:sender/:receiver/:dateTimeSend', upload, updateBySenderAndReceiverMethod)
router.post('/wait-message/update/:sender/Group/:groupChat/:dateTimeSend', upload, updateBySenderAndGroupChatMethod)

module.exports = router