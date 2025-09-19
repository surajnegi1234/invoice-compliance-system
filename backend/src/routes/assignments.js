const express = require('express');
const { getAssignments, createAssignment, deleteAssignment, getVendorsByAuditor } = require('../controllers/assignmentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();


router.get('/', authenticateToken,requireRole(['admin', 'auditor']), getAssignments);
router.post('/',authenticateToken, requireRole(['admin']), createAssignment);
router.delete('/:id',authenticateToken, requireRole(['admin']), deleteAssignment);
router.get('/vendors/:auditorId?',authenticateToken, requireRole(['admin', 'auditor']), getVendorsByAuditor);

module.exports = router;