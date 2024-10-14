// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const Task = require('./models/Task'); // Dodajte ovu liniju na vrh datoteke

// Kreiranje novog zadatka
app.post('/tasks', async (req, res) => {
    const { title, description, difficulty, priority, category } = req.body; // Uključi difficulty

    try {
        const newTask = new Task({ title, description, difficulty, priority, category }); // Uključi difficulty
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Dobijanje svih zadataka
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ažuriranje zadatka
app.put('/tasks/:id', async (req, res) => {
    const { title, description, difficulty, priority, category } = req.body; // Uključi difficulty

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { title, description, difficulty, priority, category }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Brisanje zadatka
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Arhiviranje i vraćanje zadatka
app.put('/tasks/archive/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { archived: true }, { new: true }); // Uključi archiving
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/tasks/unarchive/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { archived: false }, { new: true }); // Uključi unarchiving
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
