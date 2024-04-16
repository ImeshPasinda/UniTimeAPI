const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); // Replace with the correct path to your Express app file
const Course = require('../../models/Course');
const Faculty = require('../../models/Faculty');

// Load environment variables
require('dotenv').config();

// Fetch MongoDB URL from environment variable
const mongoUri = process.env.MONGO;

beforeAll(async () => {
    // Connect mongoose to the MongoDB database
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
});

afterAll(async () => {
    // Close the mongoose connection
    await mongoose.disconnect();
});

describe('Integration tests for course endpoints', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Course.deleteMany({});
        await Faculty.deleteMany({});
    });

    it('should create a new course', async () => {
        // Create a faculty for the course
        const faculty = await Faculty.create({ facultyId: 'faculty123', facultyName: 'Faculty 123', facultyEmail: 'faculty123@example.com' });

        // Make a request to create a new course
        const res = await request(app)
            .post('/api/courses')
            .send({
                courseId: 'course123',
                name: 'Course 123',
                description: 'Description of Course 123',
                credits: 3,
                facultyId: faculty.facultyId,
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Course created successfully');
    
        // Check if the course is saved in the database
        const course = await Course.findOne({ courseId: 'course123' });
        expect(course).toBeTruthy();
    });
});
