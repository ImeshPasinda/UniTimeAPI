const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); 
const Room = require('../../models/Room')

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

describe('Integration tests for room management', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Room.deleteMany({});
    });

    it('should create a new room', async () => {
        // Make a request to create a new room
        const res = await request(app)
            .post('/api/room/add')
            .send({
                roomId: 'room123',
                roomType: 'Conference',
                capacity: 20,
            });
    
        // Assert response
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Room created successfully');
    
        // Check if the room is saved in the database
        const room = await Room.findOne({ roomId: 'room123' });
        expect(room).toBeTruthy();
    });

    it('should get all rooms', async () => {
        // First, create some rooms for testing
        await Room.create([
            { roomId: 'room1', roomType: 'Conference', capacity: 20 },
            { roomId: 'room2', roomType: 'Meeting', capacity: 10 },
        ]);

        // Make a request to get all rooms
        const res = await request(app)
            .get('/api/room/all');
    
        // Assert response
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(2); // Assuming two rooms were created
    });
});
