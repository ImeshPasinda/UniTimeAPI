const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Booking = require('../../models/Booking');

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

describe('Integration tests for booking endpoints', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Booking.deleteMany({});
    });

    it('should book a room', async () => {
        // Make a request to book a room
        const res = await request(app)
            .post('/api/booking/add')
            .send({
                bookingId: 'booking123',
                roomId: 'room123',
                startTime: new Date(),
                endTime: new Date(new Date().getTime() + 3600 * 1000), // Assuming 1 hour booking
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Room booked successfully');
    
        // Check if the booking is saved in the database
        const booking = await Booking.findOne({ bookingId: 'booking123' });
        expect(booking).toBeTruthy();
    });

    it('should update a booking', async () => {
        // First, create a booking
        await Booking.create({ bookingId: 'booking123', roomId: 'room123', startTime: new Date(), endTime: new Date(new Date().getTime() + 3600 * 1000), memberId: 'member123' });

        // Make a request to update the booking
        const res = await request(app)
            .put('/api/booking/update/booking123')
            .send({
                roomId: 'room456',
                startTime: new Date(new Date().getTime() + 3600 * 1000), // Update start time
                endTime: new Date(new Date().getTime() + 7200 * 1000), // Update end time
                memberId: 'member456', // Update member ID
            })
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Booking updated successfully');
    
        // Check if the booking is updated in the database
        const updatedBooking = await Booking.findOne({ bookingId: 'booking123' });
        expect(updatedBooking.roomId).toBe('room456');
        // Check other updated fields as needed
    });

    it('should delete a booking', async () => {
        // First, create a booking
        await Booking.create({ bookingId: 'booking123', roomId: 'room123', startTime: new Date(), endTime: new Date(new Date().getTime() + 3600 * 1000), memberId: 'member123' });

        // Make a request to delete the booking
        const res = await request(app)
            .delete('/api/booking/delete/booking123')
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Booking deleted successfully');
    
        // Check if the booking is deleted from the database
        const deletedBooking = await Booking.findOne({ bookingId: 'booking123' });
        expect(deletedBooking).toBeNull();
    });

    it('should get all available bookings', async () => {
        // Make a request to get all available bookings
        const res = await request(app)
            .get('/api/booking/available')
            .set('Authorization', 'Bearer YOUR_AUTH_TOKEN'); // Assuming authentication token is required
    
        // Assert response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('available');
        expect(Array.isArray(res.body.available)).toBeTruthy();
    });
});
