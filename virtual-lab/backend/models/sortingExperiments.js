const mongoose = require('mongoose');

const sortingExperimentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['DSA', 'DBMS', 'DTSP', 'DVLSI'],
    default: 'DSA'
  },
  subcategory: {
    type: String,
    required: true,
    default: 'Sorting'
  },
  type: {
    type: String,
    required: true,
    enum: ['visualization', 'practice', 'graded'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  timeLimit: {
    type: Number,
    required: function() { return this.type === 'graded'; }
  },
  template: {
    type: String,
    required: function() { return this.type !== 'visualization'; }
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    hidden: {
      type: Boolean,
      default: false
    }
  }],
  hints: [{
    type: String,
    required: function() { return this.type === 'practice'; }
  }],
  metrics: {
    averageAttempts: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    averageCompletionTime: {
      type: Number,
      default: 0
    }
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SortingExperiment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experiment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SortingExperiment',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  attempts: [{
    submittedCode: String,
    passedTestCases: Number,
    totalTestCases: Number,
    timeSpent: Number,
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bestScore: {
    type: Number,
    default: 0
  },
  completedAt: Date,
  lastAttemptAt: {
    type: Date,
    default: Date.now
  }
});

const sortingSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experiment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SortingExperiment',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp'],
    default: 'javascript'
  },
  result: {
    passed: {
      type: Boolean,
      required: true
    },
    testCasesPassed: Number,
    totalTestCases: Number,
    errorMessage: String,
    executionTime: Number,
    memoryUsed: Number
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
sortingExperimentSchema.index({ category: 1, subcategory: 1, difficulty: 1 });
userProgressSchema.index({ user: 1, experiment: 1 }, { unique: true });
sortingSubmissionSchema.index({ user: 1, experiment: 1, submittedAt: -1 });

// Update timestamps on save
sortingExperimentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update user progress metrics
sortingSubmissionSchema.post('save', async function(doc) {
  const UserProgress = mongoose.model('UserProgress');
  let progress = await UserProgress.findOne({
    user: doc.user,
    experiment: doc.experiment
  });
  
  if (!progress) {
    progress = new UserProgress({
      user: doc.user,
      experiment: doc.experiment
    });
  }
  
  progress.attempts.push({
    submittedCode: doc.code,
    passedTestCases: doc.result.testCasesPassed,
    totalTestCases: doc.result.totalTestCases,
    timeSpent: doc.result.executionTime,
    feedback: doc.result.errorMessage,
    submittedAt: doc.submittedAt
  });
  
  if (doc.result.passed) {
    progress.status = 'completed';
    progress.completedAt = doc.submittedAt;
    progress.bestScore = Math.max(progress.bestScore || 0, 
      (doc.result.testCasesPassed / doc.result.totalTestCases) * 100);
  } else {
    progress.status = 'in-progress';
  }
  
  progress.lastAttemptAt = doc.submittedAt;
  await progress.save();
});

const SortingExperiment = mongoose.model('SortingExperiment', sortingExperimentSchema);
const UserProgress = mongoose.model('UserProgress', userProgressSchema);
const SortingSubmission = mongoose.model('SortingSubmission', sortingSubmissionSchema);

module.exports = {
  SortingExperiment,
  UserProgress,
  SortingSubmission
};