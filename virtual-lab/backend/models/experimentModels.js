import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['interactive', 'visualization', 'calculation'] 
  },
  fileUrl: { type: String, required: true },
  parameters: [{
    name: String,
    type: String,
    defaultValue: mongoose.Schema.Types.Mixed,
    min: Number,
    max: Number,
    options: [String]
  }]
}, { timestamps: true });

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  code: String,
  testResults: [{
    passed: Boolean,
    message: String
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const experimentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { 
    type: String, 
    required: true,
    enum: ['DSA', 'DTSP', 'DBMS', 'DVLSI'] 
  },
  experimentNumber: { 
    type: Number, 
    required: true,
    min: 1 
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  topics: [{ type: String }],
  theory: { type: String, required: true },
  objectives: [{ type: String }],
  simulation: {
    type: simulationSchema,
    required: true
  },
  quiz: [{
    question: String,
    options: [String],
    correctIndex: Number
  }],
  submissions: [submissionSchema]
}, {
  timestamps: true,
  // Compound unique index to prevent duplicate experiments for same subject
  indexes: [{ 
    subject: 1, 
    experimentNumber: 1,
    unique: true 
  }]
});

// Add validation to ensure unique experiment numbers within each subject
experimentSchema.pre('save', async function(next) {
  if (this.isModified('subject') || this.isModified('experimentNumber')) {
    const count = await mongoose.models.Experiment.countDocuments({
      subject: this.subject,
      experimentNumber: this.experimentNumber,
      _id: { $ne: this._id }
    });
    if (count > 0) {
      throw new Error(`Experiment number ${this.experimentNumber} already exists for subject ${this.subject}`);
    }
  }
  next();
});

const Experiment = mongoose.model('Experiment', experimentSchema);
export default Experiment;