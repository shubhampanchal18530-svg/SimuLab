const express = require('express');
const router = express.Router();
const { SortingExperiment, UserProgress, SortingSubmission } = require('../models/sortingExperiments');
const auth = require('../middleware/authmiddleware');
const vm = require('vm');

// Get all sorting experiments
router.get('/experiments', auth, async (req, res) => {
  try {
    const experiments = await SortingExperiment.find({
      category: 'DSA',
      subcategory: 'Sorting'
    });
    res.json(experiments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get experiment by ID
router.get('/experiments/:id', auth, async (req, res) => {
  try {
    const experiment = await SortingExperiment.findById(req.params.id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    res.json(experiment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user progress for all sorting experiments
router.get('/progress', auth, async (req, res) => {
  try {
    const progress = await UserProgress.find({ user: req.user.id })
      .populate('experiment')
      .sort({ lastAttemptAt: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit solution for testing
router.post('/submit/:id', auth, async (req, res) => {
  try {
    const experiment = await SortingExperiment.findById(req.params.id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }

    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    // Execute code in sandbox
    const sandbox = {
      console: {
        log: () => {},
        error: () => {},
        warn: () => {}
      },
      setTimeout: () => {},
      setInterval: () => {},
      require: () => {}
    };

    const context = vm.createContext(sandbox);
    let fn;
    
    try {
      vm.runInContext(code, context);
      fn = Object.values(context).find(v => typeof v === 'function');
      if (!fn) {
        throw new Error('No function found in submitted code');
      }
    } catch (error) {
      return res.status(400).json({
        passed: false,
        error: 'Code execution error: ' + error.message
      });
    }

    // Run test cases
    const results = {
      passed: true,
      testCasesPassed: 0,
      totalTestCases: experiment.testCases.length,
      executionTime: 0,
      testResults: []
    };

    for (const testCase of experiment.testCases) {
      const input = JSON.parse(JSON.stringify(testCase.input));
      const start = process.hrtime();
      
      try {
        const output = fn(input);
        const [seconds, nanoseconds] = process.hrtime(start);
        const executionTime = seconds * 1000 + nanoseconds / 1e6;
        
        const passed = JSON.stringify(output) === JSON.stringify(testCase.expectedOutput);
        results.testResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          output,
          passed,
          executionTime
        });
        
        if (passed) results.testCasesPassed++;
        results.executionTime += executionTime;
      } catch (error) {
        results.passed = false;
        results.error = error.message;
        break;
      }
    }

    results.passed = results.testCasesPassed === results.totalTestCases;

    // Save submission
    const submission = new SortingSubmission({
      user: req.user.id,
      experiment: experiment._id,
      code,
      language,
      result: {
        passed: results.passed,
        testCasesPassed: results.testCasesPassed,
        totalTestCases: results.totalTestCases,
        errorMessage: results.error,
        executionTime: results.executionTime,
        memoryUsed: process.memoryUsage().heapUsed
      }
    });
    await submission.save();

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user submissions for an experiment
router.get('/submissions/:id', auth, async (req, res) => {
  try {
    const submissions = await SortingSubmission.find({
      user: req.user.id,
      experiment: req.params.id
    }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get experiment leaderboard
router.get('/leaderboard/:id', auth, async (req, res) => {
  try {
    const progress = await UserProgress.find({
      experiment: req.params.id,
      status: 'completed'
    })
    .populate('user', 'username')
    .sort({ bestScore: -1 })
    .limit(10);
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post('/experiments', auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const experiment = new SortingExperiment(req.body);
    await experiment.save();
    res.status(201).json(experiment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/experiments/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const experiment = await SortingExperiment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(experiment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/experiments/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    await SortingExperiment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;