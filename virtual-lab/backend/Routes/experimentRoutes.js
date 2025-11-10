import express from 'express';
import mongoose from 'mongoose';
import Experiment from '../models/experimentModels.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Get all experiments (with optional subject filter)
router.get('/', async (req, res) => {
  try {
    const { subject } = req.query;
    const filter = subject ? { subject: subject.toUpperCase() } : {};
    const experiments = await Experiment.find(filter)
      .sort({ subject: 1, experimentNumber: 1 });
    res.json(experiments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single experiment by ID
router.get('/:id', async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    res.json(experiment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get experiment leaderboard
router.get('/:id/leaderboard', protect, async (req, res) => {
  try {
    const experimentId = new mongoose.Types.ObjectId(req.params.id);
    
    // Get top 10 performers based on best score and fastest completion time
    const leaderboard = await Experiment.aggregate([
      { $match: { _id: experimentId } },
      { $unwind: '$submissions' },
      { $group: {
        _id: '$submissions.user',
        bestScore: { $max: '$submissions.score' },
        attempts: { 
          $push: { 
            score: '$submissions.score', 
            timeSpent: '$submissions.timeSpent' 
          }
        }
      }},
      { $sort: { bestScore: -1, timeSpent: 1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $project: {
        user: { username: 1 },
        bestScore: 1,
        attempts: 1
      }}
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new experiment (admin only)
router.post('/', protect, async (req, res) => {
  try {
    // Validate unique experiment number for subject
    const existingExp = await Experiment.findOne({
      subject: req.body.subject,
      experimentNumber: req.body.experimentNumber
    });
    
    if (existingExp) {
      return res.status(400).json({ 
        message: `Experiment number ${req.body.experimentNumber} already exists for ${req.body.subject}` 
      });
    }

    const experiment = new Experiment(req.body);
    const savedExperiment = await experiment.save();
    res.status(201).json(savedExperiment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update experiment (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }

    // Check if update would create duplicate
    if (req.body.subject || req.body.experimentNumber) {
      const duplicate = await Experiment.findOne({
        subject: req.body.subject || experiment.subject,
        experimentNumber: req.body.experimentNumber || experiment.experimentNumber,
        _id: { $ne: req.params.id }
      });
      if (duplicate) {
        return res.status(400).json({ 
          message: 'This experiment number already exists for this subject' 
        });
      }
    }

    const updatedExperiment = await Experiment.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    res.json(updatedExperiment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete experiment (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    await experiment.remove();
    res.json({ message: 'Experiment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get experiments by subject
router.get('/subject/:subject', async (req, res) => {
  try {
    const experiments = await Experiment.find({ 
      subject: req.params.subject.toUpperCase() 
    }).sort({ experimentNumber: 1 });
    res.json(experiments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;