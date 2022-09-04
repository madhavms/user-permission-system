const router = require('express').Router();
const verify = require('./verifyToken')

/**
 * @openapi
 * /api/posts:
 *  get:
 *     tags:
 *     - Get Posts
 *     description: Returns API operational status
 *     responses:
 *       200:
 *         description: API is  running
 */

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: 'My first post', 
            description:'random data you shouldnt access'
        }
    });
})

module.exports = router;