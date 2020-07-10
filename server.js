const express = require('express');
const morgan = require("morgan");

const server = express();

const actionRouter = require('./data/helpers/actionRouter')
const projectRouter = require('./data/helpers/projectRouter')

server.use(express.json());

server.use(morgan('combined'));

server.use("/api/actions", actionRouter);
server.use("/api/projects", projectRouter);

server.get('/', logger, (req, res) => {
  res.send(`<h2>Api is currently running</h2>`);
});

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );

  next();
}
module.exports = server;
