import express from 'express';
import LoginLog from './loginLogs.js';
import { Op } from 'sequelize';

const router = express.Router();

/* ---------- Helper Function: Get Current Singapore Time ---------- */
function getSingaporeTime() {
  // Returns a Date object that represents the current Singapore local time
  const sgTimeString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
  return new Date(sgTimeString);
}

/* ---------- Logout Route ---------- */
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find the most recent login entry for the user where logoutTime is still null
    const latestLog = await LoginLog.findOne({
      where: {
        userId,
        logoutTime: { [Op.is]: null },
      },
      order: [['loginTime', 'DESC']],
    });

    if (!latestLog) {
      return res.status(404).json({ message: 'No active login found for user' });
    }

    // Store logout time in Singapore timezone
    const singaporeTime = getSingaporeTime();
    latestLog.logoutTime = singaporeTime;
    await latestLog.save();

    console.log(`Logout recorded for user ${userId} at ${singaporeTime}`);

    return res.status(200).json({
      message: 'Logout time stored successfully',
      logoutTime: singaporeTime,
    });

  } catch (error) {
    console.error('Logout time update failed:', error);
    return res.status(500).json({ message: 'Error updating logout time', error: error.message });
  }
});

export default router;
