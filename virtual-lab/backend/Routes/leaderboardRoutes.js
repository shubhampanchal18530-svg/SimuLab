const express = require('express');
const router = express.Router();
const { Experiment } = require('../models/experimentModels');
const auth = require('../middleware/authmiddleware');

// Get experiment leaderboard
router.get('/leaderboard/:id', auth, async (req, res) => {
  try {
    const experimentId = req.params.id;
    
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

module.exports = router;