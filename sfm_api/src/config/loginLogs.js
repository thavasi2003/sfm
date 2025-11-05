import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './user.js';
import moment from 'moment-timezone'; // Import moment-timezone

// Always return Singapore time using moment-timezone
function getSingaporeTime() {
  return moment().tz('Asia/Singapore').toDate();
}

const LoginLog = sequelize.define('LoginLog', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  email: { type: DataTypes.STRING, allowNull: false },
  loginMethod: { type: DataTypes.STRING, allowNull: true },
  ipAddress: { type: DataTypes.STRING, allowNull: true },
  userAgent: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'success' },
  loginTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => getSingaporeTime(), // Function form
  },
  logoutTime: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: false,
  hooks: {
    beforeCreate: (log) => {
      log.loginTime = getSingaporeTime(); // Ensure SG time
    },
    beforeUpdate: (log) => {
      if (log.changed('logoutTime')) {
        log.logoutTime = getSingaporeTime(); // Ensure SG time
      }
    }
  }
});

// Sync changes
await sequelize.sync({ alter: true });

export default LoginLog;
