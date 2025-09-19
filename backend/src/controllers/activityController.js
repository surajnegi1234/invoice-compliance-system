const nodemailer = require('nodemailer');

const getActivities = async (req, res) => {
  try {
    const { Activity, Assignment } = req.tenant.models;
    let filter = {};

    if (req.user.role === 'vendor') {
      filter.user = req.user._id;
    } else if (req.user.role === 'auditor') {
      const assignments = await Assignment.find({ auditor: req.user._id, isActive: true });
      const vendorIds = assignments.map(a => a.vendor);
      vendorIds.push(req.user._id);
      filter.user = { $in: vendorIds };
    }

    const activities = await Activity.find(filter)
      .populate('user', 'name email role')
      .populate('relatedDocument', 'title category')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendReminder = async (req, res) => {
  try {
    const { Assignment, User, Activity } = req.tenant.models;
    const { vendorId, message, subject } = req.body;

    if (req.user.role !== 'auditor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to send reminders' });
    }

    if (req.user.role === 'auditor') {
      const assignment = await Assignment.findOne({
        auditor: req.user._id,
        vendor: vendorId,
        isActive: true
      });
      if (!assignment) {
        return res.status(403).json({ message: 'Not authorized for this vendor' });
      }
    }

    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await Activity.create({
      user: req.user._id,
      action: 'send_reminder',
      description: `Sent reminder to ${vendor.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ message: 'Reminder sent successfully' });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ message: 'Failed to send reminder' });
  }
};

const generateReport = async (req, res) => {
  try {
    const { Activity, Assignment } = req.tenant.models;
    const { vendorId, startDate, endDate } = req.query;

    if (req.user.role !== 'auditor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to generate reports' });
    }

    let filter = {};
    
    if (vendorId) {
      filter.user = vendorId;
      
      if (req.user.role === 'auditor') {
        const assignment = await Assignment.findOne({
          auditor: req.user._id,
          vendor: vendorId,
          isActive: true
        });
        if (!assignment) {
          return res.status(403).json({ message: 'Not authorized for this vendor' });
        }
      }
    } else if (req.user.role === 'auditor') {
      const assignments = await Assignment.find({ auditor: req.user._id, isActive: true });
      const vendorIds = assignments.map(a => a.vendor);
      filter.user = { $in: vendorIds };
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const activities = await Activity.find(filter)
      .populate('user', 'name email role')
      .populate('relatedDocument', 'title category status')
      .sort({ createdAt: -1 });

    const report = {
      generatedBy: req.user.name,
      generatedAt: new Date(),
      tenant: req.tenant.id,
      period: { startDate, endDate },
      totalActivities: activities.length,
      activities: activities
    };

    res.json(report);
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getActivities,
  sendReminder,
  generateReport
};