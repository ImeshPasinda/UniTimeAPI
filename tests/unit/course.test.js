const mongoose = require('mongoose');
const Course = require('../../models/Course');

describe('Course Model', () => {
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
  //   await Course.deleteMany({}); // Clean up database after each test
  // });

  it('should be able to save a course', async () => {
    const courseData = {
      courseId: 'CSE101',
      name: 'Introduction to Computer Science',
      description: 'A fundamental course introducing basics of computer science.',
      credits: 3,
      facultyId: 'faculty123',
    };

    const course = new Course(courseData);
    await course.save();

    const savedCourse = await Course.findOne({ courseId: 'CSE101' });
    expect(savedCourse.courseId).toBe(courseData.courseId);
    expect(savedCourse.name).toBe(courseData.name);
    expect(savedCourse.description).toBe(courseData.description);
    expect(savedCourse.credits).toBe(courseData.credits);
    expect(savedCourse.facultyId).toBe(courseData.facultyId);
  });

  it('should fail to save if required fields are missing', async () => {
    const course = new Course({}); // Missing required fields

    let error;
    try {
      await course.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.courseId.message).toBe('Path `courseId` is required.');
    expect(error.errors.name.message).toBe('Path `name` is required.');
    expect(error.errors.credits.message).toBe('Path `credits` is required.');
    expect(error.errors.facultyId.message).toBe('Path `facultyId` is required.');
  });
});
