const router = require('express').Router()
const upload = require('../middleware/upload')

router.get('/', (req, res) => {
    return res.render('index')
})

module.exports = router