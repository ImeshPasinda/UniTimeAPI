const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (roles) => async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from the database using the decoded user ID
    const user = await User.findById(decoded.memberId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    // Check if the user has the required role
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized - Insufficient role' });
    }

    // Set user details in the request object
    req.memberId = user.memberId;
    req.userrole = user.role; // Set userrole in the request object

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = {
  verifyToken,
};
