const Notification = require('../models/Notification');
const Room = require('../models/Room');

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get room by ID
const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new room
const createRoom = async (req, res) => {
  try {
    const { roomId, roomType, capacity } = req.body;
    const newRoom = new Room({ roomId, roomType, capacity });

    const notification = new Notification({
      user: 'Public',
      title: `New room created: ${roomId}`,
      text: `A new ${roomType} room with ID ${roomId} and capacity ${capacity} has been created.`
    });

    await notification.save();
    await newRoom.save();
    res.status(201).json({ message: `Room created successfully. Notification sent to ${notification.user}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update room by ID
const updateRoomById = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { roomType, capacity } = req.body;

    const updatedRoom = await Room.findOneAndUpdate(
      { roomId },
      { $set: { roomType, capacity } },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Create and save notification
    const notification = new Notification({
      user: 'Public',
      title: `Room updated: ${roomId}`,
      text: `The room with ID ${roomId} has been updated. New details: Room Type - ${roomType}, Capacity - ${capacity}.`
    });

    await notification.save();

    res.status(200).json({ message: `Room updated successfully. Notification sent to ${notification.user}.`, updatedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete room by ID
const deleteRoomById = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const deletedRoom = await Room.findOneAndDelete({ roomId });

    if (!deletedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Create and save notification
    const notification = new Notification({
      user: 'Public',
      title: `Room deleted: ${roomId}`,
      text: `The ${deletedRoom.roomType} room with ID ${roomId} and capacity ${deletedRoom.capacity} has been deleted.`
    });

    await notification.save();

    res.status(200).json({ message: `Room deleted successfully. Notification sent to ${notification.user}.`, deletedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoomById,
  deleteRoomById,
};
