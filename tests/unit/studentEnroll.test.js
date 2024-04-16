const mongoose = require('mongoose');
const StudentEnroll = require('../../models/studentEnroll');

describe('StudentEnroll Model', () => {
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
  //   await StudentEnroll.deleteMany({}); // Clean up database after each test
  // });

  it('should be able to save a student enrollment', async () => {
    const enrollmentData = {
      studentId: 'student123',
      courseId: 'course123',
    };

    const studentEnroll = new StudentEnroll(enrollmentData);
    await studentEnroll.save();

    const savedEnrollment = await StudentEnroll.findOne({ studentId: 'student123' });
    expect(savedEnrollment.studentId).toBe(enrollmentData.studentId);
    expect(savedEnrollment.courseId).toBe(enrollmentData.courseId);
    expect(savedEnrollment.enrollmentDate).toBeInstanceOf(Date);
  });

  it('should fail to save if required fields are missing', async () => {
    const studentEnroll = new StudentEnroll({}); // Missing required fields

    let error;
    try {
      await studentEnroll.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.studentId.message).toBe('Path `studentId` is required.');
    expect(error.errors.courseId.message).toBe('Path `courseId` is required.');
  });
});
