// controllers/statsController.js
const User = require('../Model/User');
const Problem = require('../Model/Problem');
const Submission = require('../Model/Submissions');
const mongoose = require('mongoose');

const getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. Total problems solved
    const user = await User.findById(userId).populate('problemSolved', 'difficulty');

    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalSolved = user.problemSolved.length;

    // 2. Problems solved by difficulty
    const difficultyStats = {
      easy: 0,
      medium: 0,
      difficult: 0,
    };

    user.problemSolved.forEach(problem => {
      difficultyStats[problem.difficulty]++;
    });

    // 3. Submissions grouped by language
    const langStats = await Submission.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), status: 'accepted' } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
    ]);

    // 4. Weekly submission trends (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

    const trendStats = await Submission.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%a", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // 5. Average runtime and memory
    const perfStats = await Submission.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          status: 'accepted',
        },
      },
      {
        $group: {
          _id: null,
          avgRuntime: { $avg: "$runtime" },
          avgMemory: { $avg: "$memory" },
        },
      },
    ]);

    return res.json({
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName || ''}`,
        totalSolved,
        difficultyStats,
      },
      languageUsage: langStats,
      weeklyTrends: trendStats,
      averagePerformance: perfStats[0] || { avgRuntime: 0, avgMemory: 0 },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error : ' , err });
  }
};

module.exports = { getUserStats };
