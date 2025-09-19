const express = require('express');
const {getDocuments,uploadDocument,updateDocument,deleteDocument,upload} = require('../controllers/documentController');
const {authenticateToken,requireRole} = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getDocuments);

// Upload new document - vendors uploadauditors can upload for vendors
router.post('/', authenticateToken, upload.single('file'), uploadDocument);

// Update document - mainly for status changes by auditors
router.put('/:id', authenticateToken, updateDocument);

router.delete('/:id', authenticateToken, deleteDocument);

module.exports = router;