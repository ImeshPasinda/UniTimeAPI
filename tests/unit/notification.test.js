const mongoose = require('mongoose');
const Notification = require('../../models/Notification');

describe('Notification Model', () => {
  beforeAll(async () => {
    require('dotenv').config(); // Load environment variables
    
    // Connect to MongoDB
    const { MONGO } = process.env; // Fetch MongoDB URL from environment variable
    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close connection after all tests
  });

  // afterEach(async () => {
  //   await Notification.deleteMany({}); // Clean up database after each test
  // });

  it('should be able to save a notification', async () => {
    const notificationData = {
      user: 'user123',
      title: 'New Message',
      text: 'You have a new message!',
    };

    const notification = new Notification(notificationData);
    await notification.save();

    const savedNotification = await Notification.findOne({ user: 'user123' });
    expect(savedNotification.user).toBe(notificationData.user);
    expect(savedNotification.title).toBe(notificationData.title);
    expect(savedNotification.text).toBe(notificationData.text);
    expect(savedNotification.read).toBe(false); // Should default to false
    expect(savedNotification.timestamp).toBeInstanceOf(Date);
  });

  it('should fail to save if required fields are missing', async () => {
    const notification = new Notification({}); // Missing required fields

    let error;
    try {
      await notification.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.user.message).toBe('Path `user` is required.');
    expect(error.errors.title.message).toBe('Path `title` is required.');
    expect(error.errors.text.message).toBe('Path `text` is required.');
  });
});
