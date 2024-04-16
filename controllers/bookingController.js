const Booking = require('../models/Booking');
const Timetable = require('../models/Timetable');
const Room = require('../models/Room');
const User = require('../models/User');

const bookRoom = async (req, res) => {
    try {
        const { bookingId, roomId, startTime, endTime } = req.body;

        // Check if the room is available at the specified time
        const isRoomAvailable = await checkRoomAvailability(roomId, startTime, endTime);

        if (!isRoomAvailable) {
            return res.status(400).json({ message: 'Room is not available at the specified time' });
        }
        const memberId = req.memberId
        console.log(memberId)
        // Book the room
        const newBooking = new Booking({ bookingId, roomId, startTime, endTime, memberId });
        await newBooking.save();

        res.status(201).json({ message: 'Room booked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const checkRoomAvailability = async (roomId, startTime, endTime) => {

    const roomExists = await Room.exists({ roomId });

    if (!roomExists) {
        return false;
    }

    // Check if there is any overlapping booking with the same roomId, startTime, and endTime
    const overlappingBooking = await Booking.findOne({
        roomId,
        startTime,
        endTime,
    });

    // Check if there is any overlapping timetable entry with the same roomId, startTime, and endTime
    const overlappingTimetable = await Timetable.findOne({
        roomId,
        startTime,
        endTime,
    });

    return !overlappingBooking && !overlappingTimetable;
};

const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { roomId, startTime, endTime, memberId } = req.body;

        // Check if the booking to be updated exists
        const existingBooking = await Booking.findOne({ bookingId });

        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if the provided room ID exists
        const existingRoom = await Room.findOne({ roomId: roomId });

        if (!existingRoom) {
            return res.status(400).json({ message: 'Room not found' });
        }

        // Check if the provided member ID exists
        const existingMember = await User.findOne({ memberId: memberId });

        if (!existingMember) {
            return res.status(400).json({ message: 'Member not found' });
        }

        // Check if the room is available at the specified time for the update
        const isRoomAvailable = await checkRoomAvailability(roomId, startTime, endTime);

        if (!isRoomAvailable) {
            return res.status(400).json({ message: 'Room is not available at the specified time' });
        }

        // Update the booking details
        existingBooking.roomId = roomId;
        existingBooking.startTime = startTime;
        existingBooking.endTime = endTime;
        existingBooking.memberId = memberId;

        await existingBooking.save();

        res.status(200).json({ message: 'Booking updated successfully', updatedBooking: existingBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const deletedBooking = await Booking.findOneAndDelete({ bookingId: bookingId });

        if (!deletedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully', deletedBooking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllAvailableBookings = async (req, res) => {
    try {

        const allRoomIds = await Room.find({}, 'roomId');
        const bookedRoomIds = await Booking.distinct('roomId');
        const timetableRoomIds = await Timetable.distinct('roomId');

        const availableRoomIds = allRoomIds
            .map((room) => room.roomId)
            .filter((roomId) => !bookedRoomIds.includes(roomId) && !timetableRoomIds.includes(roomId));

        const availableRooms = await Room.find({ roomId: { $in: availableRoomIds } });
        const bookedRooms = await Booking.find({ roomId: { $in: bookedRoomIds } });
        res.status(200).json({ available: availableRooms, booked: bookedRooms, unavailable: timetableRoomIds });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    bookRoom,
    updateBooking,
    deleteBooking,
    getAllAvailableBookings
};
