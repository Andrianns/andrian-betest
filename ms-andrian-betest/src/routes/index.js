const router = require('express').Router();
const controller = require('../controllers');
const authentication = require('../middleware/authentication');

router.get('/', controller.findAllUser);
router.get('/find', controller.findSpecificUser);
router.post('/', controller.createUser);
router.put('/:_id', controller.updateUserById);

module.exports = router;
