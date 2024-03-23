const router = require('express').Router()
const upload = require('../middleware/upload')
let {
    createOrUpdateMethod,
    findAllMethod,
    findByIdMethod,
    deleteByIdMethod,
    loginMethod
} = require('../controllers/accountController')

router.get('/accounts', findAllMethod)
router.get('/accounts/:id', findByIdMethod)
router.post('/accounts', upload, createOrUpdateMethod)
router.delete('/accounts/:id', deleteByIdMethod)
router.post('/login', loginMethod)

module.exports = router