const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  videoUrl: { type: String },
  textContent: { type: String },
  quiz: {
    question: String,
    options: [String],
    correctAnswerIndex: Number,
  }
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [ModuleSchema] 
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);