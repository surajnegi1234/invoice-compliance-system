const express = require('express');
const { getActivities, sendReminder, generateReport } = require('../controllers/activityController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();


router.get('/', authenticateToken,getActivities);
router.post('/reminder',authenticateToken, requireRole(['admin', 'auditor']), sendReminder);
router.get('/report',authenticateToken, requireRole(['admin', 'auditor']), generateReport);

module.exports = router;