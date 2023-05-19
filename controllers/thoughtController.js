const { ObjectId } = require('mongoose').Types;
const { Student, Course } = require('../models');

// Aggregate function to get the number of students overall
const headCount = async () => {
  const numberOfStudents = await Student.aggregate()
    .count('studentCount');
  return numberOfStudents;
}

// Aggregate function for getting the overall grade using $avg
const grade = async (studentId) =>
  Student.aggregate([
    // only include the given student by using $match
    { $match: { _id: new ObjectId(studentId) } },
    {
      $unwind: '$assignments',
    },
    {
      $group: {
        _id: new ObjectId(studentId),
        overallGrade: { $avg: '$assignments.score' },
      },
    },
  ]);

module.exports = {
  // Get all students
  async getStudents(req, res) {
    try {
      const students = await Student.find();

      const studentObj = {
        students,
        headCount: await headCount(),
      };

      res.json(studentObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single student
  async getSingleStudent(req, res) {
    try {
      const student = await Student.findOne({ _id: req.params.studentId })
        .select('-__v');

      if (!student) {
        return res.status(404).json({ message: 'No student with that ID' })
      }

      res.json({
        student,
        grade: await grade(req.params.studentId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new student
  async createStudent(req, res) {
    try {
      const student = await Student.create(req.body);
      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a student and remove them from the course
  async deleteStudent(req, res) {
    try {
      const student = await Student.findOneAndRemove({ _id: req.params.studentId });

      if (!student) {
        return res.status(404).json({ message: 'No such student exists' });
      }

      const course = await Course.findOneAndUpdate(
        { students: req.params.studentId },
        { $pull: { students: req.params.studentId } },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({
          message: 'Student deleted, but no courses found',
        });
      }

      res.json({ message: 'Student successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an assignment to a student
  async addAssignment(req, res) {
    console.log('You are adding an assignment');
    console.log(req.body);

    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
      );

      if (!student) {
        return res
          .status(404)
          .json({ message: 'No student found with that ID :(' });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeAssignment(req, res) {
    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
        { runValidators: true, new: true }
      );

      if (!student) {
        return res
          .status(404)
          .json({ message: 'No student found with that ID :(' });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
