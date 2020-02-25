const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: Number,
    required: [true, 'Please add a number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
});

module.exports = mongoose.model('Course', CourseSchema);
