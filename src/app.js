const express = require("express");
const { request, response } = require("express");
const cors = require("cors");
const { v4: uuidv4, validate } = require("uuid");

// by npm uuidv4 is deprecated and recommend uuid 

const app = express();

app.use(express.json());
app.use(cors());

/**
 * Middlewares
 */

function verifyValidId(request, response, next) {
  const { id } = request.params;

  if (!validate(id)) {
    return response.status(400).json({ error: `Bad Request: This repository does not exist!` });
  }

  next();
}

app.use("/repositories/:id", verifyValidId);

const repositories = [];

/**
 * Routes
 */

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuidv4(),
    title, url, techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: `Bad Request: This repository does not exist!` });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
