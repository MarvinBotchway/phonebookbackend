const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123452',
    id: '1',
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: '2',
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: '3',
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: '4',
  },
];

app.get('/', (req, res) => {
  res.send('<p>Hello World!</p>');
});

app.get('/info', (req, res) => {
  const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `;
  res.send(info);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) res.json(person);
  else res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons/', (req, res) => {
  const body = req.body;

  if (!body) return res.status(400).json({ error: 'content missing' });
  if (!body.name)
    return res.status(400).json({ error: 'you must provide a name' });
  if (!body.number)
    return res.status(400).json({ error: 'you must provide a number' });

  const nameInDb = persons.find(
    (person) => person.name.toLowerCase() === body.name.trim().toLowerCase()
  );

  if (nameInDb) return res.status(400).json({ error: 'name must be unique' });

  const person = {
    name: body.name,
    number: body.number,
    id: String(Math.floor(Math.random() * 1000000)),
  };

  persons = persons.concat(person);
  return res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
