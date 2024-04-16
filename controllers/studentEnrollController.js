const StudentEnroll = require('../models/studentEnroll');
const Course = require('../models/Course'); // Assuming you have a Course model
const User = require('../models/User');
const Timetable = require('../models/Timetable');

// Enroll a student in a course
const enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Check if the course with the provided code exists
        const memberExists = await User.exists({ memberId: studentId });

        if (!memberExists) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the course with the provided code exists
        const courseExists = await Course.exists({ courseId: courseId });

        if (!courseExists) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the student is already enrolled in the course
        const alreadyEnrolled = await StudentEnroll.exists({ studentId, courseId });

        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'Student already enrolled in the course' });
        }

        // Enroll the student in the course
        const newEnrollment = new StudentEnroll({ studentId, courseId });
        await newEnrollment.save();

        res.status(201).json({ message: 'Student enrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteEnrollmentByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        const memberExists = await User.exists({ memberId: studentId });

        if (!memberExists) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find and delete the enrollment by student ID
        await StudentEnroll.deleteOne({ studentId });

        res.status(200).json({ message: 'Student enrollment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Other controller functions (update, delete, get enrollments, etc.) can be added as needed.
const getEnrollmentsByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Check if the student exists
        const memberExists = await User.exists({ memberId: studentId });

        if (!memberExists) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find all enrollments for the student
        const enrollments = await StudentEnroll.find({ studentId });

        // Manually populate course data for each enrollment
        const populatedEnrollments = await Promise.all(
            enrollments.map(async (enrollment) => {
                const courseId = enrollment.courseId;
                const studentId = enrollment.studentId;


                const course = await Course.findOne({ courseId });
                const time = await Timetable.findOne({ courseId });
                const member = await User.findOne({ memberId: studentId }).select('-password -email -role'); // Exclude password and email

                return {
                    ...enrollment.toObject(),
                    member,
                    course,
                    time

                };
            })
        );

        res.status(200).json(populatedEnrollments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    enrollStudent,
    deleteEnrollmentByStudentId,
    getEnrollmentsByStudentId
};
