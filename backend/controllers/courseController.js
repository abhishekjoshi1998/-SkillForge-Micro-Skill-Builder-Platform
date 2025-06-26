const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 }).populate('instructor', 'name');
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCourseById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createCourse = async (req, res) => {
    const { title, description, modules } = req.body;
    if (!title || !description) {
        return res.status(400).json({ msg: 'Please include a title and description.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'instructor') {
            return res.status(403).json({ msg: 'User is not authorized to create courses' });
        }
        const newCourse = new Course({
            title,
            description,
            modules,
            instructor: req.user.id
        });
        const course = await newCourse.save();
        user.coursesCreated.push(course._id);
        await user.save();
        res.status(201).json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.enrollInCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);
        if (!course || !user) {
            return res.status(404).json({ msg: 'Resource not found' });
        }
        if (course.instructor.toString() === user._id.toString()) {
            return res.status(400).json({ msg: 'Instructors cannot enroll in their own course' });
        }
        if (user.coursesEnrolled.some(enrolledCourseId => enrolledCourseId.toString() === courseId)) {
            return res.status(400).json({ msg: 'User is already enrolled in this course' });
        }
        user.coursesEnrolled.push(course._id);
        await user.save();
        res.json({ msg: 'Successfully enrolled in course', coursesEnrolled: user.coursesEnrolled });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateCourse = async (req, res) => {
    const { title, description, modules } = req.body;
    const courseId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        let course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'User not authorized to update this course' });
        }

        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (modules) updateFields.modules = modules;

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.json(updatedCourse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteCourse = async (req, res) => {
    const courseId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'User not authorized to delete this course' });
        }

        await Promise.all([
            Course.findByIdAndDelete(courseId),
            User.updateMany(
                { coursesEnrolled: courseId },
                { $pull: { coursesEnrolled: courseId } }
            ),
            User.findByIdAndUpdate(
                course.instructor,
                { $pull: { coursesCreated: courseId } }
            )
        ]);

        res.json({ msg: 'Course and all associated enrollments have been removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};