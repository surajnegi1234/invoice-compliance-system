const multer = require('multer');
const path = require('path');

// File upload configuration - took some time to get this right
const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, 'uploads/');
  },
  filename: (req,file,cb) => {
    // Generate unique filename to avoid conflicts
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: (req,file,cb) => {
    // Only allow certain file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if(mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only documents and images are allowed'));
    }
  }
});

const getDocuments = async(req,res) => {
  try {
    const {Document,Assignment} = req.tenant.models;
    let filter = {};

    // Vendors can only see their own documents
    if(req.user.role === 'vendor') {
      filter.vendor = req.user._id;
    } 
    // Auditors can see documents from their assigned vendors
    else if(req.user.role === 'auditor') {
      const assignments = await Assignment.find({auditor: req.user._id, isActive: true});
      const vendorIds = assignments.map(a => a.vendor);
      filter.vendor = {$in: vendorIds};
    }
    // Admins can see everything - no filter needed

    const documents = await Document.find(filter)
      .populate('vendor', 'name email')
      .populate('uploadedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({createdAt: -1});

    res.json({
      success: true,
      documents: documents
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch documents'
    });
  }
};

const uploadDocument = async(req,res) => {
  try {
    const {Document,Assignment,Activity} = req.tenant.models;
    const {title,category,vendorId} = req.body;
    const uploadedFile = req.file;

    if(!uploadedFile) {
      return res.status(400).json({
        success: false,
        message: 'Please select a file to upload'
      });
    }

    if(!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required'
      });
    }

    // Determine which vendor this document belongs to
    let targetVendorId = vendorId;
    if(req.user.role === 'vendor') {
      targetVendorId = req.user._id;
    }

    if(!targetVendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required'
      });
    }

 
    if(req.user.role === 'auditor') {
      const assignment = await Assignment.findOne({
        auditor: req.user._id,
        vendor: targetVendorId,
        isActive: true
      });
      
      if(!assignment) {
        return res.status(403).json({
          success: false,
          message: 'You are not assigned to this vendor'
        });
      }
    }

    // Create the document record
    const newDocument = await Document.create({
      title,
      category,
      filePath: uploadedFile.path,
      fileName: uploadedFile.originalname,
      fileSize: uploadedFile.size,
      mimeType: uploadedFile.mimetype,
      vendor: targetVendorId,
      uploadedBy: req.user._id
    });

    // Log the activity
    try {
      await Activity.create({
        user: req.user._id,
        action: 'upload_document',
        description: `Uploaded document: ${title}`,
        relatedDocument: newDocument._id
      });
    } catch(actErr) {
      console.log('Activity logging failed:', actErr.message);
    }

    // Get populated document for response
    const populatedDoc = await Document.findById(newDocument._id)
      .populate('vendor', 'name email')
      .populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: populatedDoc
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: 'Document upload failed'
    });
  }
};

const updateDocument = async(req,res) => {
  try {
    const {Document,Assignment,Activity} = req.tenant.models;
    const {id} = req.params;
    const {title,category,status,comments} = req.body;

    let filter = {_id: id};

    // Apply control filters
    if(req.user.role === 'vendor') {
      filter.vendor = req.user._id;
    } else if(req.user.role === 'auditor') {
      const assignments = await Assignment.find({auditor: req.user._id, isActive: true});
      const vendorIds = assignments.map(a => a.vendor);
      filter.vendor = {$in: vendorIds};
    }

    const updateData = {title, category};
    
    // Only auditors and admins can change status
    if(status && req.user.role !== 'vendor') {
      updateData.status = status;
      updateData.reviewedBy = req.user._id;
      updateData.reviewDate = new Date();
      if(comments) updateData.comments = comments;
    }

    const updatedDocument = await Document.findOneAndUpdate(filter, updateData, {new: true})
      .populate('vendor', 'name email')
      .populate('uploadedBy', 'name email')
      .populate('reviewedBy', 'name email');

    if(!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or access denied'
      });
    }

    // Log status change activity
    if(status && req.user.role !== 'vendor') {
      try {
        await Activity.create({
          user: req.user._id,
          action: status === 'approved' ? 'approve_document' : 'review_document',
          description: `Document ${status}: ${updatedDocument.title}`,
          relatedDocument: updatedDocument._id
        });
      } catch(actErr) {
        console.log('Activity logging failed:', actErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Document updated successfully',
      document: updatedDocument
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: 'Document update failed'
    });
  }
};

const deleteDocument = async(req,res) => {
  try {
    const {Document,Assignment} = req.tenant.models;
    const {id} = req.params;

    let filter = {_id: id};

    // Apply access control
    if(req.user.role === 'vendor') {
      filter.vendor = req.user._id;
    } else if(req.user.role === 'auditor') {
      const assignments = await Assignment.find({auditor: req.user._id, isActive: true});
      const vendorIds = assignments.map(a => a.vendor);
      filter.vendor = {$in: vendorIds};
    }

    const deletedDocument = await Document.findOneAndDelete(filter);

    if(!deletedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch(error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Document deletion failed'
    });
  }
};

module.exports = {
  getDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
  upload
};