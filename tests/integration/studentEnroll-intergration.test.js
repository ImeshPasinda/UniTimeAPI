const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const StudentEnroll = require('../../models/studentEnroll');
const Course = require('../../models/Course');
const User = require('../../models/User');
const Timetable = require('../../models/Timetable');

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

describe('Integration tests for student enrollments', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await StudentEnroll.deleteMany({});
        await Course.deleteMany({});
        await User.deleteMany({});
        await Timetable.deleteMany({});
    });

    it('should enroll a student in a course', async () => {
        // First, create a user (student)
        const user = await User.create({ memberId: 'student123', username: 'TestStudent', email: 'teststudent@example.com', password: 'password123', role: 'Student' });

        // Next, create a course
        const course = await Course.create({ courseId: 'course123', name: 'Test Course', description: 'Test course description', credits: 3, facultyId: 'faculty123' });

        // Make a request to enroll the student in the course
        const res = await request(app)
            .post('/api/student-enroll/add')
            .send({
                studentId: user.memberId,
                courseId: course.courseId
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Student enrolled successfully');
    
        // Check if the enrollment is saved in the database
        const enrollment = await StudentEnroll.findOne({ studentId: user.memberId, courseId: course.courseId });
        expect(enrollment).toBeTruthy();
    });

    it('should delete enrollment of a student', async () => {
        // First, create a user (student)
        const user = await User.create({ memberId: 'student123', username: 'TestStudent', email: 'teststudent@example.com', password: 'password123', role: 'Student' });

        // Next, create a course
        const course = await Course.create({ courseId: 'course123', name: 'Test Course', description: 'Test course description', credits: 3, facultyId: 'faculty123' });

        // Enroll the student in the course
        await StudentEnroll.create({ studentId: user.memberId, courseId: course.courseId });

        // Make a request to delete enrollment of the student
        const res = await request(app)
            .delete(`/api/student-enroll/delete/${user.memberId}`)
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Student enrollment deleted successfully');
    
        // Check if the enrollment is deleted from the database
        const enrollment = await StudentEnroll.findOne({ studentId: user.memberId });
        expect(enrollment).toBeNull();
    });

    it('should get all enrollments of a student', async () => {
        // First, create a user (student)
        const user = await User.create({ memberId: 'student123', username: 'TestStudent', email: 'teststudent@example.com', password: 'password123', role: 'Student' });

        // Next, create a course
        const course = await Course.create({ courseId: 'course123', name: 'Test Course', description: 'Test course description', credits: 3, facultyId: 'faculty123' });

        // Enroll the student in the course
        await StudentEnroll.create({ studentId: user.memberId, courseId: course.courseId });

        // Make a request to get all enrollments of the student
        const res = await request(app)
            .get(`/api/student-enroll/all/${user.memberId}`)
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1); // Assuming one enrollment is created
        expect(res.body[0].studentId).toBe(user.memberId);
        expect(res.body[0].courseId).toBe(course.courseId);
    });
});
