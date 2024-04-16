const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { memberId, username, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ memberId, username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token with both email and userId in the payload
    const token = jwt.sign({ memberId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Include user details in the response
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserBymemberId = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const { username, email, password, userrole } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user in the database by memberId
    const updatedUser = await User.findOneAndUpdate(
      { memberId: memberId },
      {
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        userrole,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUserBymemberId = async (req, res) => {
  try {
    const userIdToDelete = req.params.memberId;

    // Find and delete user from the database by user ID
    const deletedUser = await User.findOneAndDelete({ memberId: userIdToDelete });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from the response
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserBymemberId = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    // Find the user by memberId, excluding the password from the response
    const user = await User.findOne({ memberId: memberId }, { password: 0 });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const memberId = req.memberId;

    // Find the user by memberId, excluding the password from the response
    const user = await User.findOne({ memberId: memberId }, { password: 0 });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const memberId = req.memberId;
    const { username, email, newPassword } = req.body;

    // Find the user by memberId
    const user = await User.findOne({ memberId: memberId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user properties if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (newPassword) {
      // Hash and update the password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    // Exclude the password from the response
    const updatedUser = await User.findOne(
      { memberId: memberId },
      { password: 0 }
    );

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

module.exports = {
  register,
  login,
  updateUserBymemberId,
  deleteUserBymemberId,
  getUsers,
  getUserBymemberId,
  getProfile,
  updateProfile
};
