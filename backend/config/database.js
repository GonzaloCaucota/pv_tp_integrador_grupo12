const { Sequelize } = require("sequelize");

// Conexion centralizada a PostgreSQL.
// Si no hay variables de entorno, usa valores locales por defecto.
const sequelize = new Sequelize(
  process.env.DB_NAME || "visualback",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "admin123",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
