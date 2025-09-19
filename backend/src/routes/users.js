const express = require('express');
const { getUsers, registerUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.get('/',authenticateToken, requireRole(['admin', 'auditor']), getUsers);
router.post('/', authenticateToken,requireRole(['admin']), registerUser);
router.put('/:id',authenticateToken, updateUser);
router.delete('/:id',authenticateToken, requireRole(['admin']), deleteUser);

module.exports = router;