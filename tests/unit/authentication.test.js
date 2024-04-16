const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
  beforeAll(async () => {
    require('dotenv').config(); // Load environment variables
    const mongoose = require('mongoose');
    
    const { MONGO } = process.env; // Fetch MongoDB URL from environment variable

    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });


  afterAll(async () => {
    await mongoose.connection.close();
  });

  // afterEach(async () => {
  //   await User.deleteMany({});
  // });

  it('should be able to save a user', async () => {
    const userData = {
      memberId: '12345',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'Admin',
    };

    const user = new User(userData);
    await user.save();

    const savedUser = await User.findOne({ memberId: '12345' });
    expect(savedUser.memberId).toBe(userData.memberId);
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email.toLowerCase()); // Email should be lowercased by pre-save hook
    expect(savedUser.role).toBe(userData.role);
  });

  it('should fail to save if required fields are missing', async () => {
    const user = new User({}); // Missing required fields

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.memberId.message).toBe('Path `memberId` is required.');
    expect(error.errors.username.message).toBe('Path `username` is required.');
    expect(error.errors.email.message).toBe('Path `email` is required.');
    expect(error.errors.password.message).toBe('Path `password` is required.');
  });

  it('should fail to save if memberId or username or email is not unique', async () => {
    const userData1 = {
      memberId: '12345',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'Admin',
    };

    const userData2 = {
      memberId: '12345', // Same memberId as userData1
      username: 'testuser2',
      email: 'test@example.com', // Same email as userData1
      password: 'password456',
      role: 'User',
    };    

    const user1 = new User(userData1);
    await user1.save();

    const user2 = new User(userData2);

    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.memberId.message).toBe('Error, expected `memberId` to be unique.');
    expect(error.errors.email.message).toBe('Error, expected `email` to be unique.');
  });
});
