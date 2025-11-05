import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbconfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbconfig);

pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL as id " + connection.threadId);
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("Error Connecting to MySQL: " + err.stack);
  });

export default pool;
