const express = require('express');
const router = express.Router();
const userRouter = require('./User')
const accountRouter = require('./account')

router.get('/', (req, res) => { 
    res.send("This is route Main path");
})

router.use('/user', userRouter);
router.use('/account', accountRouter);

module.exports = router;