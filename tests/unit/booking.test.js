const mongoose = require('mongoose');
const Booking = require('../../models/Booking');

describe('Booking Model', () => {
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
  //   await Booking.deleteMany({}); // Clean up database after each test
  // });

  it('should be able to save a booking', async () => {
    const bookingData = {
      bookingId: '1234567890',
      roomId: 'room123',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
      memberId: 'member123',
    };

    const booking = new Booking(bookingData);
    await booking.save();

    const savedBooking = await Booking.findOne({ bookingId: '1234567890' });
    expect(savedBooking.bookingId).toBe(bookingData.bookingId);
    expect(savedBooking.roomId).toBe(bookingData.roomId);
    expect(savedBooking.startTime.getTime()).toBe(bookingData.startTime.getTime());
    expect(savedBooking.endTime.getTime()).toBe(bookingData.endTime.getTime());
    expect(savedBooking.memberId).toBe(bookingData.memberId);
  });

  it('should fail to save if required fields are missing', async () => {
    const booking = new Booking({}); // Missing required fields

    let error;
    try {
      await booking.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.bookingId.message).toBe('Path `bookingId` is required.');
    expect(error.errors.roomId.message).toBe('Path `roomId` is required.');
    expect(error.errors.startTime.message).toBe('Path `startTime` is required.');
    expect(error.errors.endTime.message).toBe('Path `endTime` is required.');
    expect(error.errors.memberId.message).toBe('Path `memberId` is required.');
  });
});
