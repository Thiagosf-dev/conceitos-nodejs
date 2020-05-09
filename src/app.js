const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// function validateId(request, response, next) {
//   const { id } = request.params.id;

//   if (!isUuid(id)) return response.status(400).json({ error: 'Invalid ID!' });

//   return next();
// }

// app.use("/repositories/:id", validateId);

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(repositorie => repositorie.title === title)
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repositorie = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json({ error: 'Invalid ID!' });

  const repositorieIndex = repositories.findIndex(project => project.id === id);
  if (repositorieIndex < 0) return response.status(400).json({ error: 'Repositorie not found!' });

  const { url, title, techs } = request.body;
  const likes = !repositories[repositorieIndex].likes ? 0 : repositories[repositorieIndex].likes;
  const repositorie = { id, url, title, techs, likes };
  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(project => project.id === id);
  if (repositorieIndex < 0) return response.status(400).json({ error: 'Repositorie not found!' });

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(project => project.id === id);
  if (repositorieIndex < 0) return response.status(400).json({ error: 'Repositorie not found!' });

  repositories[repositorieIndex].likes += 1;
  const repositorie = repositories[repositorieIndex];

  return response.json(repositorie);
});

module.exports = app;
