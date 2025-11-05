import { DataTypes } from 'sequelize';
import sequelize from "./sequelize.js";

function getSingaporeTime() {
  const sgTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
  return new Date(sgTime);
}

const User = sequelize.define('User', {
  googleId: { type: DataTypes.STRING, allowNull: true },
  microsoftId: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  loginMethod: { type: DataTypes.STRING, allowNull: false },
  is2FAEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  twoFAToken: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (user) => {
      user.createdAt = getSingaporeTime();
      user.updatedAt = getSingaporeTime();
    },
    beforeUpdate: (user) => {
      user.updatedAt = getSingaporeTime();
    }
  }
});

await sequelize.sync({ alter: true });
export default User;
