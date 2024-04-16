const mongoose = require('mongoose');
const Room = require('../../models/Room');

describe('Room Model', () => {
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
  //   await Room.deleteMany({}); // Clean up database after each test
  // });

  it('should be able to save a room', async () => {
    const roomData = {
      roomId: 'room123',
      roomType: 'Conference',
      capacity: 20,
    };

    const room = new Room(roomData);
    await room.save();

    const savedRoom = await Room.findOne({ roomId: 'room123' });
    expect(savedRoom.roomId).toBe(roomData.roomId);
    expect(savedRoom.roomType).toBe(roomData.roomType);
    expect(savedRoom.capacity).toBe(roomData.capacity);
  });

  it('should fail to save if required fields are missing', async () => {
    const room = new Room({}); // Missing required fields

    let error;
    try {
      await room.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.roomId.message).toBe('Path `roomId` is required.');
    expect(error.errors.roomType.message).toBe('Path `roomType` is required.');
    expect(error.errors.capacity.message).toBe('Path `capacity` is required.');
  });

  it('should fail to save if roomId is not unique', async () => {
    const roomData1 = {
      roomId: 'room123',
      roomType: 'Conference',
      capacity: 20,
    };

    const roomData2 = {
      roomId: 'room123', // Same roomId as roomData1
      roomType: 'Meeting',
      capacity: 10,
    };

    const room1 = new Room(roomData1);
    await room1.save();

    const room2 = new Room(roomData2);

    let error;
    try {
      await room2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.roomId.message).toBe('Error, expected `roomId` to be unique.');
  });
});
