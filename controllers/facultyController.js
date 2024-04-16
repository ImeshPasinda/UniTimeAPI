const Faculty = require('../models/Faculty');

// Create a new faculty 
const createFaculty = async (req, res) => {
  try {
    const { facultyId, facultyName, facultyEmail } = req.body;
    const existingFaculty = await Faculty.findOne({ $or: [{ facultyId }, { facultyEmail }] });
    if (existingFaculty) {
      return res.status(400).json({ error: 'FacultyId or Email already exists' });
    }

    const newFaculty = new Faculty({ facultyId, facultyName, facultyEmail });
    await newFaculty.save();

    res.status(201).json({ message: 'Faculty created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all faculties
const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;

    // Find and remove the faculty member by ID
    const deletedFaculty = await Faculty.findOneAndDelete({ facultyId: facultyId });

    if (!deletedFaculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update faculty information by ID
const updateFaculty = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    const { facultyName, facultyEmail } = req.body;

    // Find the faculty member by ID
    const faculty = await Faculty.findOne({ facultyId: facultyId });

    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Update faculty properties if provided

    if (facultyName) {
      faculty.facultyName = facultyName;
    }

    if (facultyEmail) {
      faculty.facultyEmail = facultyEmail;
    }

    // Save the updated faculty member
    await faculty.save();

    res.status(200).json({ message: 'Faculty information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createFaculty,
  getAllFaculties,
  deleteFaculty,
  updateFaculty
};
