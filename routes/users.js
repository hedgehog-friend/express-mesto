const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/users', createUser);

module.exports = router;
