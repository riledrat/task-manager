// server/models/Task.js

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    archived: {
        type: Boolean,
        default: false
    },
    difficulty: {
        type: String, 
        enum: ['Easy', 'Medium', 'Hard'],
        required: true // Ova linija je bitna
    },
    priority: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'],
        required: true 
    }, 
    category: { 
        type: String, 
        enum: ['Work', 'Personal', 'Urgent'],
        required: true 
    }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
