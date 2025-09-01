import express from "express";
import cors from "cors";
import tasks from "./tasks.mjs";

const PORT = process.env.PORT || 5555;
const app = express();
app.use(cors());
app.use(express.json());


app.post('/tasks', (req, res) => {
  const text = (req.body?.text ?? '').trim();
  if (!text) return res.status(400).json({ message: 'text is required' });

  const newTask = { id: Date.now(), text, done: false };
  tasks.first.push(newTask);
  res.status(201).json(newTask);
});


app.get('/tasks', (req, res) => {
  res.json(tasks.first);
});


app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const t = tasks.first.find(x => x.id === id);
  if (!t) return res.status(404).json({ message: 'Task not found' });

  if (req.body.text !== undefined) {
    const s = String(req.body.text).trim();
    if (!s) return res.status(400).json({ message: 'text cannot be empty' });
    t.text = s;
  }
  if (req.body.done !== undefined) {
    t.done = Boolean(req.body.done);
  }
  res.json(t);
});


app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.first.length;
  tasks.first = tasks.first.filter(x => x.id !== id);
  if (tasks.first.length === before) return res.status(404).json({ message: 'Task not found' });
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`);
});