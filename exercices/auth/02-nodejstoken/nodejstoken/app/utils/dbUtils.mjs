import mysql from "mysql2/promise";

const dbConfig = {
  host: "db",
  user: "root",
  password: "root",
  database: "db_authentication",
  multipleStatements: false,
};

export const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to the database");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};
