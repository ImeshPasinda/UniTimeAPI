const Course = require('../models/Course');
const Faculty = require('../models/Faculty');

//create a course
const createCourse = async (req, res) => {
  try {
    const { courseId, name, description, credits, facultyId } = req.body;
    const newCourse = new Course({ courseId, name, description, credits, facultyId });

    // Check if the provided faculty ID exists
    const existingFaculty = await Faculty.findOne({ facultyId: facultyId });

    if (!existingFaculty) {
      return res.status(400).json({ message: 'Faculty not found' });
    }
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    // Find all courses
    const courses = await Course.find();

    // Manually populate faculty data based on facultyId
    const populatedCourses = await Promise.all(
      courses.map(async (course) => {
        const facultyId = course.facultyId;

        // Find the related faculty data
        const faculty = await Faculty.findOne({ facultyId });

        // Attach the faculty data to the course object
        return {
          ...course.toObject(),
          faculty,
        };
      })
    );

    res.status(200).json(populatedCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get course by courseId with populated faculty data
const getCourseBycourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Find the course by courseId
    const course = await Course.findOne({ courseId: courseId });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Manually populate faculty data based on facultyId
    const facultyId = course.facultyId;
    const faculty = await Faculty.findOne({ facultyId });

    // Attach the faculty data to the course object
    const populatedCourse = {
      ...course.toObject(),
      faculty,
    };

    res.status(200).json(populatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Update course by courseId
const updateCourseBycourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { name, description, credits, facultyId } = req.body;

    // Check if the provided faculty ID exists
    const existingFaculty = await Faculty.findOne({ facultyId: facultyId });

    if (!existingFaculty) {
      return res.status(400).json({ message: 'Faculty not found' });
    }

    // Update the course
    const updatedCourse = await Course.findOneAndUpdate(
      { courseId: courseId },
      {
        $set: {
          name,
          description,
          credits,
          facultyId,
        },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete course by ID
const deleteCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    await Course.findOneAndDelete({ courseId: courseId });

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseBycourseId,
  updateCourseBycourseId,
  deleteCourseById
};
