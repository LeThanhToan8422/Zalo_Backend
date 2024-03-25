const router = require('express').Router()
const upload = require('../middleware/upload')

router.get('/', (req, res) => {
    return res.render('index')
})

router.post('/', upload, (req, res) => {
    console.log(req);
    return res.render('index')
})

module.exports = router