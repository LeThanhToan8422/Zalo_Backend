const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    findByRecipientMethod
} = require('../controllers/makeFriendsController');

router.get('/make-friends', findAllMethod)
router.get('/make-friends/:id', findByIdMethod)
router.post('/make-friends', upload, createMethod)
router.delete('/make-friends/:id', deleteByIdMethod)
router.get('/make-friends/givers/:recipient', findByRecipientMethod)

module.exports = router