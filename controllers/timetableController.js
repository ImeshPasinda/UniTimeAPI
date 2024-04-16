const Timetable = require('../models/Timetable');
const Faculty = require('../models/Faculty');
const Room = require('../models/Room');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

const createTimetable = async (req, res) => {
  try {
    const { timetableId, courseId, startTime, endTime, facultyId, roomId } = req.body;

    const newTimetable = new Timetable({ timetableId, courseId, startTime, endTime, facultyId, roomId });

    // Check if the provided room ID exists
    const existingCourse = await Course.findOne({ courseId: courseId });

    if (!existingCourse) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Check if the provided faculty ID exists
    const existingFaculty = await Faculty.findOne({ facultyId: facultyId });

    if (!existingFaculty) {
      return res.status(400).json({ message: 'Faculty not found' });
    }

    // Check if the provided room ID exists
    const existingRoom = await Room.findOne({ roomId: roomId });

    if (!existingRoom) {
      return res.status(400).json({ message: 'Room not found' });
    }
    const notification = new Notification({
      user: 'Public',
      title: `New timetable created: ${roomId}`,
      text: `A new timetable with ID ${timetableId} has been created. Details: Course ID: ${courseId}, Start Time: ${startTime}, End Time: ${endTime}, Faculty ID: ${facultyId}, Room ID: ${roomId}.`
    });

    await notification.save();
    await newTimetable.save();
    res.status(201).json({ message: `Timetable entry created successfully. Notification sent to ${notification.user}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update timetable entry by ID
const updateTimetableEntryBytimetableId = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;
    const { courseId, startTime, endTime, facultyId, roomId } = req.body;

    // Check if the provided room ID exists
    const existingCourse = await Course.findOne({ courseId: courseId });

    if (!existingCourse) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Check if the provided faculty ID exists
    const existingFaculty = await Faculty.findOne({ facultyId: facultyId });

    if (!existingFaculty) {
      return res.status(400).json({ message: 'Faculty not found' });
    }

    // Check if the provided room ID exists
    const existingRoom = await Room.findOne({ roomId: roomId });

    if (!existingRoom) {
      return res.status(400).json({ message: 'Room not found' });
    }

    // Update the timetable entry
    const updatedTimetableEntry = await Timetable.findOneAndUpdate(
      { timetableId: timetableId },
      {
        $set: {
          courseId,
          startTime,
          endTime,
          facultyId,
          roomId,
        },
      },
      { new: true }
    );

    if (!updatedTimetableEntry) {
      return res.status(404).json({ error: 'Timetable entry not found' });
    }

    const notification = new Notification({
      user: 'Public',
      title: `Timetable entry updated: ${timetableId}`,
      text: `The timetable entry with ID ${timetableId} has been updated. Updated details: Course ID - ${courseId}, Start Time - ${startTime}, End Time - ${endTime}, Faculty ID - ${facultyId}, Room ID - ${roomId}.`
    });

    await notification.save();

    res.status(200).json({ message: `Timetable entry updated successfully. Notification sent to ${notification.user}.`, updatedTimetableEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete timetable entry by ID
const deleteTimetableEntryBytimetableId = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;

    // Delete the timetable entry
    const deletedTimetableEntry = await Timetable.findOneAndDelete({ timetableId: timetableId });

    if (!deletedTimetableEntry) {
      return res.status(404).json({ error: 'Timetable entry not found' });
    }

    // Create and save notification for the deleted timetable entry
    const notification = new Notification({
      user: 'Public',
      title: `Timetable entry deleted: ${timetableId}`,
      text: `The timetable entry with ID ${timetableId} has been deleted. Details: Course ID - ${deletedTimetableEntry.courseId}, Start Time - ${deletedTimetableEntry.startTime}, End Time - ${deletedTimetableEntry.endTime}, Faculty ID - ${deletedTimetableEntry.facultyId}, Room ID - ${deletedTimetableEntry.roomId}.`
    });

    await notification.save();

    res.status(200).json({ message: `Timetable entry deleted successfully. Notification sent to ${notification.user}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all timetable entries with populated faculty and room data
const getAllTimetableEntriesBytimetableId = async (req, res) => {
  try {
    // Find all timetable entries
    const timetableEntries = await Timetable.find();

    // Manually populate faculty and room data for each timetable entry
    const populatedTimetableEntries = await Promise.all(
      timetableEntries.map(async (timetableEntry) => {
        const courseId = timetableEntry.courseId;
        const facultyId = timetableEntry.facultyId;
        const roomId = timetableEntry.roomId;

        // Find course data based on courseId
        const course = await Course.findOne({ courseId });

        // Find faculty data based on facultyId
        const faculty = await Faculty.findOne({ facultyId });

        // Find room data based on roomId
        const room = await Room.findOne({ roomId });

        // Attach the faculty and room data to the timetable entry object
        return {
          ...timetableEntry.toObject(),
          course,
          faculty,
          room,
        };
      })
    );

    res.status(200).json(populatedTimetableEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createTimetable,
  updateTimetableEntryBytimetableId,
  deleteTimetableEntryBytimetableId,
  getAllTimetableEntriesBytimetableId,
};
