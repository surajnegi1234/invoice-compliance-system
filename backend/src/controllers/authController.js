const sendToken = require('../utils/sendToken');

const login = async(req,res)=>{
  try{
    const {email,password} = req.body;

    if(!email || !password){
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }
    const {User,Activity} = req.tenant.models;
    
    let userFound = await User.findOne({email: email, isActive: true});
    
    if(!userFound){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    
    // Check password
    const isPasswordMatched = await userFound.comparePassword(password);
    
    if(!isPasswordMatched){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    
    // Update last login time
    userFound.lastLogin = new Date();
    await userFound.save();

    try {
      await Activity.create({
        user: userFound._id,
        action: 'login',
        description: `User ${userFound.name} logged in successfully`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch(activityError) {
      console.log('Activity logging failed:', activityError.message);
    }
    
    await sendToken(userFound, 200, res, "Login successful", req.tenant.id);
    
  } catch(error) {
    console.error('Login error occurred:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong during login'
    });
  }
};

const logout = async(req,res) => {
  try {
    // Log logout activity if user exists
    if(req.user) {
      const {Activity} = req.tenant.models;
      try {
        await Activity.create({
          user: req.user._id,
          action: 'logout',
          description: `User ${req.user.name} logged out`,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
      } catch(err) {
        console.log('Logout activity logging failed:', err.message);
      }
    }
    
    // Clear the cookie with same settings as login
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
    
  } catch(error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Get current user profile
const getProfile = async(req,res) => {
  try {
    const currentUser = req.user;
    
    res.status(200).json({
      success: true,
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        lastLogin: currentUser.lastLogin
      },
      tenant: req.tenant.id
    });
    
  } catch(error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch profile'
    });
  }
};

module.exports = {
  login,
  logout,
  getProfile
};