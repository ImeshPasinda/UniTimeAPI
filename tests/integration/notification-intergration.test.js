const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); 
const Notification = require('../../models/Notification'); 
const User = require('../../models//User');

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

describe('Integration tests for notification management', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Notification.deleteMany({});
        await User.deleteMany({});
    });

    it('should post a notification for a specific user', async () => {
        // First, create a user for testing
        await User.create({
            memberId: 'testuser123',
            // Add other user details if needed
        });

        // Make a request to post a notification for the user
        const res = await request(app)
            .post('/api/notification/add')
            .send({
                user: 'testuser123', // Use the memberId of the test user
                title: 'Test Notification',
                text: 'This is a test notification',
            });
    
        // Assert response
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Notification posted successfully' });
    
        // Check if the notification is saved in the database
        const notification = await Notification.findOne({ title: 'Test Notification' });
        expect(notification).toBeTruthy();
    });

    it('should get notifications for a specific user', async () => {
        // First, create some notifications for testing
        await Notification.create([
            {
                user: 'testuser123',
                title: 'Test Notification 1',
                text: 'This is test notification 1',
            },
            {
                user: 'testuser123',
                title: 'Test Notification 2',
                text: 'This is test notification 2',
            },
        ]);

        // Make a request to get notifications for the user
        const res = await request(app)
            .get('/api/notification/get/testuser123') // Use the memberId of the test user
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(2); // Assuming two notifications were created
    });
});
