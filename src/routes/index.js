const { Router } = require('express');

const routes = Router();

routes.get("/",(req,res) => {
  res.status(200).json({ mensagem: "👍" });
})

module.exports = routes;