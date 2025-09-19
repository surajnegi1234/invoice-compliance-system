const getAssignments = async (req, res) => {
  try {
    const { Assignment } = req.tenant.models;
    let filter = {};

    if (req.user.role === 'auditor') {
      filter.auditor = req.user._id;
    }

    const assignments = await Assignment.find(filter)
      .populate('auditor', 'name email')
      .populate('vendor', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { Assignment, User } = req.tenant.models;
    const { auditor_id, vendor_id } = req.body;

    if (!auditor_id || !vendor_id) {
      return res.status(400).json({ message: 'Auditor ID and Vendor ID are required' });
    }

    const auditor = await User.findOne({ _id: auditor_id, role: 'auditor' });
    const vendor = await User.findOne({ _id: vendor_id, role: 'vendor' });

    if (!auditor) {
      return res.status(400).json({ message: 'Invalid auditor ID' });
    }

    if (!vendor) {
      return res.status(400).json({ message: 'Invalid vendor ID' });
    }

    const existingAssignment = await Assignment.findOne({
      auditor: auditor_id,
      vendor: vendor_id,
      isActive: true
    });

    if (existingAssignment) {
      return res.status(400).json({ message: 'Assignment already exists' });
    }

    const assignment = await Assignment.create({
      auditor: auditor_id,
      vendor: vendor_id,
      assignedBy: req.user._id
    });

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('auditor', 'name email')
      .populate('vendor', 'name email')
      .populate('assignedBy', 'name email');

    res.status(201).json(populatedAssignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { Assignment } = req.tenant.models;
    const { id } = req.params;

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getVendorsByAuditor = async (req, res) => {
  try {
    const { Assignment } = req.tenant.models;
    const auditorId = req.user.role === 'auditor' ? req.user._id : req.params.auditorId;

    const assignments = await Assignment.find({ 
      auditor: auditorId, 
      isActive: true 
    }).populate('vendor', 'name email');

    const vendors = assignments.map(assignment => ({
      ...assignment.vendor.toObject(),
      assignedAt: assignment.createdAt
    }));

    res.json(vendors);
  } catch (error) {
    console.error('Get vendors by auditor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  deleteAssignment,
  getVendorsByAuditor
};