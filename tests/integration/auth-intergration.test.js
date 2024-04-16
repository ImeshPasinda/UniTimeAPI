const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');

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

describe('Integration tests for authentication endpoints', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await User.deleteMany({});
    });

    it('should register a new user', async () => {
        // Make a request to register a new user
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                memberId: 'member123',
                username: 'user123',
                email: 'user123@example.com',
                password: 'password123',
            });
    
        // Assert response
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    
        // Check if the user is saved in the database
        const user = await User.findOne({ memberId: 'member123' });
        expect(user).toBeTruthy();
    });

    it('should login an existing user', async () => {
        // First, register a user
        await User.create({ memberId: 'member123', username: 'user123', email: 'user123@example.com', password: 'password123' });

        // Make a request to login the user
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user123@example.com',
                password: 'password123',
            });
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.token).toBeTruthy();
    });

    it('should update a user by memberId', async () => {
        // First, register a user
        await User.create({ memberId: 'member123', username: 'user123', email: 'user123@example.com', password: 'password123' });

        // Make a request to update the user
        const res = await request(app)
            .put('/api/auth/users/member123')
            .send({
                username: 'updatedUser',
                email: 'updated@example.com',
                password: 'updatedPassword',
                userrole: 'Admin', // Assuming userrole can be updated
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'User updated successfully');
    
        // Check if the user is updated in the database
        const updatedUser = await User.findOne({ memberId: 'member123' });
        expect(updatedUser.username).toBe('updatedUser');
    });

});
