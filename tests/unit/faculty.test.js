const mongoose = require('mongoose');
const Faculty = require('../../models/Faculty');

describe('Faculty Model', () => {
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
  //   await Faculty.deleteMany({}); // Clean up database after each test
  // });

  it('should be able to save a faculty', async () => {
    const facultyData = {
      facultyId: 'FAC001',
      facultyName: 'John Doe',
      facultyEmail: 'john.doe@example.com',
    };

    const faculty = new Faculty(facultyData);
    await faculty.save();

    const savedFaculty = await Faculty.findOne({ facultyId: 'FAC001' });
    expect(savedFaculty.facultyId).toBe(facultyData.facultyId);
    expect(savedFaculty.facultyName).toBe(facultyData.facultyName);
    expect(savedFaculty.facultyEmail).toBe(facultyData.facultyEmail);
  });

  it('should fail to save if required fields are missing', async () => {
    const faculty = new Faculty({}); // Missing required fields

    let error;
    try {
      await faculty.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.facultyId.message).toBe('Path `facultyId` is required.');
    expect(error.errors.facultyName.message).toBe('Path `facultyName` is required.');
    expect(error.errors.facultyEmail.message).toBe('Path `facultyEmail` is required.');
  });

  it('should fail to save if facultyId or facultyEmail is not unique', async () => {
    const facultyData1 = {
      facultyId: 'FAC001',
      facultyName: 'John Doe',
      facultyEmail: 'john.doe@example.com',
    };

    const facultyData2 = {
      facultyId: 'FAC001', // Same facultyId as facultyData1
      facultyName: 'Jane Smith',
      facultyEmail: 'jane.smith@example.com',
    };

    const faculty1 = new Faculty(facultyData1);
    await faculty1.save();

    const faculty2 = new Faculty(facultyData2);

    let error;
    try {
      await faculty2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.facultyId.message).toBe('Error, expected `facultyId` to be unique.');
    expect(error.errors.facultyEmail.message).toBe('Error, expected `facultyEmail` to be unique.');
  });
});
