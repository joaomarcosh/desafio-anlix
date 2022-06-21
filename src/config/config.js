require('dotenv/config');

const config = {
  development: {
    username: `${process.env.DB_username}`,
    password: `${process.env.DB_password}`,
    database: `${process.env.DB_database}`,
    host: `${process.env.DB_host}`,
    dialect: `${process.env.DB_dialect}`
  }
}

module.exports = config;