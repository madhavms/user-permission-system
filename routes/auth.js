const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Routes
/**
 * @openapi
 * /api/user/register:
 *  post:
 *     parameters:
 *     
 *     tags:
 *     - Register User
 *     description: Returns API operational status
 *     responses:
 *       200:
 *         description: API is  running
 */
router.post('/register', async (req, res) => {

    //Lets validate the data before we make user
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if user is already in database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }
    catch(err) {
        res.status(400).send(err);
    }
});

/**
 * @openapi
 * /api/user/login:
 *  post:
 *     parameters:
 *     
 *     tags:
 *     - Register User
 *     description: Returns API operational status
 *     responses:
 *       200:
 *         description: API is  running
 */

router.post('/login', async (req, res) => {
    //Validate the data 
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send(`Email is not found`);
    //check password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid Password')

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);
});

module.exports = router;