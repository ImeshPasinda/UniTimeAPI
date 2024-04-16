const mongoose = require('mongoose');
const Timetable = require('../../models/Timetable');

describe('Timetable Model', () => {
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
  //   await Timetable.deleteMany({}); // Clean up database after each test
  // });

  it('should be able to save a timetable', async () => {
    const timetableData = {
      timetableId: 'timetable123',
      courseId: 'course123',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
      facultyId: 'faculty123',
      roomId: 'room123',
    };

    const timetable = new Timetable(timetableData);
    await timetable.save();

    const savedTimetable = await Timetable.findOne({ timetableId: 'timetable123' });
    expect(savedTimetable.timetableId).toBe(timetableData.timetableId);
    expect(savedTimetable.courseId).toBe(timetableData.courseId);
    expect(savedTimetable.startTime.getTime()).toBe(timetableData.startTime.getTime());
    expect(savedTimetable.endTime.getTime()).toBe(timetableData.endTime.getTime());
    expect(savedTimetable.facultyId).toBe(timetableData.facultyId);
    expect(savedTimetable.roomId).toBe(timetableData.roomId);
  });

  it('should fail to save if required fields are missing', async () => {
    const timetable = new Timetable({}); // Missing required fields

    let error;
    try {
      await timetable.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.timetableId.message).toBe('Path `timetableId` is required.');
    expect(error.errors.courseId.message).toBe('Path `courseId` is required.');
    expect(error.errors.startTime.message).toBe('Path `startTime` is required.');
    expect(error.errors.endTime.message).toBe('Path `endTime` is required.');
    expect(error.errors.facultyId.message).toBe('Path `facultyId` is required.');
    expect(error.errors.roomId.message).toBe('Path `roomId` is required.');
  });
});
