const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Timetable = require('../../models/Timetable');
const Course = require('../../models/Course');
const Faculty = require('../../models/Faculty');
const Room = require('../../models/Room');
const Notification = require('../../models/Notification');

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

describe('Integration tests for timetable endpoints', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Timetable.deleteMany({});
        await Course.deleteMany({});
        await Faculty.deleteMany({});
        await Room.deleteMany({});
        await Notification.deleteMany({});
    });

    it('should create a timetable entry', async () => {
        // First, create necessary data (course, faculty, room)
        const course = await Course.create({ courseId: 'course123', name: 'Test Course', description: 'Test course description', credits: 3, facultyId: 'faculty123' });
        const faculty = await Faculty.create({ facultyId: 'faculty123', facultyName: 'Test Faculty', facultyEmail: 'faculty@example.com' });
        const room = await Room.create({ roomId: 'room123', roomType: 'Test Room', capacity: 50 });

        // Make a request to create a timetable entry
        const res = await request(app)
            .post('/api/timetable/add')
            .send({
                timetableId: 'timetable123',
                courseId: course.courseId,
                startTime: new Date(),
                endTime: new Date(),
                facultyId: faculty.facultyId,
                roomId: room.roomId
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Timetable entry created successfully');
    
        // Check if the timetable entry is saved in the database
        const timetableEntry = await Timetable.findOne({ timetableId: 'timetable123' });
        expect(timetableEntry).toBeTruthy();
    });

    it('should update a timetable entry', async () => {
        // First, create a timetable entry
        const timetableEntry = await Timetable.create({ timetableId: 'timetable123', courseId: 'course123', startTime: new Date(), endTime: new Date(), facultyId: 'faculty123', roomId: 'room123' });

        // Make a request to update the timetable entry
        const res = await request(app)
            .put(`/api/timetable/update/${timetableEntry.timetableId}`)
            .send({
                courseId: 'course456',
                startTime: new Date(),
                endTime: new Date(),
                facultyId: 'faculty456',
                roomId: 'room456'
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Timetable entry updated successfully');
    
        // Check if the timetable entry is updated in the database
        const updatedTimetableEntry = await Timetable.findOne({ timetableId: 'timetable123' });
        expect(updatedTimetableEntry.courseId).toBe('course456');
        expect(updatedTimetableEntry.facultyId).toBe('faculty456');
        expect(updatedTimetableEntry.roomId).toBe('room456');
    });

    it('should delete a timetable entry', async () => {
        // First, create a timetable entry
        const timetableEntry = await Timetable.create({ timetableId: 'timetable123', courseId: 'course123', startTime: new Date(), endTime: new Date(), facultyId: 'faculty123', roomId: 'room123' });

        // Make a request to delete the timetable entry
        const res = await request(app)
            .delete(`/api/timetable/delete/${timetableEntry.timetableId}`)
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Timetable entry deleted successfully');
    
        // Check if the timetable entry is deleted from the database
        const deletedTimetableEntry = await Timetable.findOne({ timetableId: 'timetable123' });
        expect(deletedTimetableEntry).toBeNull();
    });

    it('should get all timetable entries with populated data', async () => {
        // First, create necessary data (course, faculty, room)
        const course = await Course.create({ courseId: 'course123', name: 'Test Course', description: 'Test course description', credits: 3, facultyId: 'faculty123' });
        const faculty = await Faculty.create({ facultyId: 'faculty123', facultyName: 'Test Faculty', facultyEmail: 'faculty@example.com' });
        const room = await Room.create({ roomId: 'room123', roomType: 'Test Room', capacity: 50 });

        // Create a timetable entry
        await Timetable.create({ timetableId: 'timetable123', courseId: course.courseId, startTime: new Date(), endTime: new Date(), facultyId: faculty.facultyId, roomId: room.roomId });

        // Make a request to get all timetable entries
        const res = await request(app)
            .get('/api/timetable/all')
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1); // Assuming one timetable entry is created
        expect(res.body[0].course.courseId).toBe(course.courseId);
        expect(res.body[0].faculty.facultyId).toBe(faculty.facultyId);
        expect(res.body[0].room.roomId).toBe(room.roomId);
    });
});
