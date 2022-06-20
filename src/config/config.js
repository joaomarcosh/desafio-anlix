require('dotenv/config');

const config = {
  development: {
    username: `${process.env.PG_username}`,
    password: `${process.env.PG_password}`,
    database: `${process.env.PG_database}`,
    host: `${process.env.PG_host}`,
    dialect: 'postgres'
  }
}

module.exports = config;