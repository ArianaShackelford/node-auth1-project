const router = require('express').Router();

const authRoute = require('../auth/auth-router.js');
const userRoute = require('../users/user-router.js');


router.use('/auth', authRoute);
router.use('/users', userRoute);

router.get('/', (req,res) => {
    res.status(200).json({ message: "Api is up and running"})
});

module.exports = router;