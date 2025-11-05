import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    timezone: "+08:00", // Store all dates in Singapore time
    dialectOptions: {
      dateStrings: true,
      typeCast: true, // For reading DATE as string (not UTC)
    },
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log("Sequelize connected successfully (SG Time Mode)!"))
  .catch((err) => console.error("Sequelize connection error:", err));

export default sequelize;
