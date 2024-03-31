const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createMethod,
    updateMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    loginMethod,
    checkPhoneMethod
} = require('../controllers/accountController')

router.get('/accounts', findAllMethod)
router.get('/accounts/:id', findByIdMethod)
router.post('/accounts', upload, createMethod)
router.put('/accounts', upload, updateMethod)
router.delete('/accounts/:id', deleteByIdMethod)
router.post('/login', loginMethod)
router.get('/accounts/phone/:phone', checkPhoneMethod)

module.exports = router