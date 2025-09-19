// Cookie token sender - had to look this up online
module.exports = async(user, statusCode, res, message, tenantId) => {
 const token = user.getJWTToken(tenantId);
 
 // Cookie options - expires in 7 days by default
 const options = {
  expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: true, // always secure for production deployment
  sameSite: 'none' // allow cross-origin cookies
 };

 // Send response with cookie
 res.status(statusCode).cookie("token", token, options).json({
  success: true,
  message,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  },
  tenant: tenantId
 });
};