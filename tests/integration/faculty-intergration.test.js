const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
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

describe('Integration tests for faculty endpoints', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Faculty.deleteMany({});
    });

    it('should create a new faculty', async () => {
        // Make a request to create a new faculty
        const res = await request(app)
            .post('/api/faculty')
            .send({
                facultyId: 'faculty123',
                facultyName: 'John Doe',
                facultyEmail: 'john.doe@example.com'
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Faculty created successfully');
    
        // Check if the faculty is saved in the database
        const faculty = await Faculty.findOne({ facultyId: 'faculty123' });
        expect(faculty).toBeTruthy();
    });

    it('should get all faculties', async () => {
        // First, create some faculties in the database
        await Faculty.create([
            { facultyId: 'faculty1', facultyName: 'Faculty 1', facultyEmail: 'faculty1@example.com' },
            { facultyId: 'faculty2', facultyName: 'Faculty 2', facultyEmail: 'faculty2@example.com' },
            { facultyId: 'faculty3', facultyName: 'Faculty 3', facultyEmail: 'faculty3@example.com' }
        ]);
    
        // Make a request to get all faculties
        const res = await request(app)
            .get('/api/faculty');
    
        // Assert response
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(3); // Assuming three faculties are created
    });

    it('should update faculty information', async () => {
        // First, create a faculty
        await Faculty.create({ facultyId: 'faculty123', facultyName: 'John Doe', facultyEmail: 'john.doe@example.com' });

        // Make a request to update the faculty information
        const res = await request(app)
            .put('/api/faculty/faculty123')
            .send({
                facultyName: 'Jane Doe',
                facultyEmail: 'jane.doe@example.com'
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Faculty information updated successfully');
    
        // Check if the faculty information is updated in the database
        const updatedFaculty = await Faculty.findOne({ facultyId: 'faculty123' });
        expect(updatedFaculty.facultyName).toBe('Jane Doe');
        expect(updatedFaculty.facultyEmail).toBe('jane.doe@example.com');
    });

    it('should delete a faculty', async () => {
        // First, create a faculty
        await Faculty.create({ facultyId: 'faculty123', facultyName: 'John Doe', facultyEmail: 'john.doe@example.com' });

        // Make a request to delete the faculty
        const res = await request(app)
            .delete('/api/faculty/faculty123')
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Faculty deleted successfully');
    
        // Check if the faculty is deleted from the database
        const deletedFaculty = await Faculty.findOne({ facultyId: 'faculty123' });
        expect(deletedFaculty).toBeNull();
    });
});
