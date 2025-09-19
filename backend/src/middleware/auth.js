const jwt = require('jsonwebtoken');

const authenticateToken = async(req,res,next) => {
  try {
    const {token} = req.cookies;
    
    if(!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource'
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if(decodedData.tenantId !== req.tenant.id) {
      return res.status(403).json({
        success: false,
        message: 'Invalid'
      });
    }

    const {User} = req.tenant.models;
    const currentUser = await User.findById(decodedData.id).select('-password');
    
    if(!currentUser || !currentUser.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    req.user = currentUser;
    next();
    
  } catch(error) {
    console.log('Auth middleware error:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const requireRole = (roles) => {
  return (req,res,next) => {
    if(!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if(!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    
    next();
  };
};

const requireOwnershipOrRole = (allowedRoles) => {
  return async(req,res,next) => {
    if(!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login first'
      });
    }
    
    if(req.user.role === 'admin') {
      return next();
    }
    
    if(allowedRoles.includes(req.user.role)) {
      if(req.user.role === 'vendor') {
        req.vendorFilter = req.user._id;
      } else if(req.user.role === 'auditor') {
        req.auditorFilter = req.user._id;
      }
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message:'Invalid Permission'
    });
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnershipOrRole
};