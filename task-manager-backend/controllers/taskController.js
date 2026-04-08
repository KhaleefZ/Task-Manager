const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save(); // This triggers the pre-save hook
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { taskNumber: req.params.id }, // ID here is the string "Task 1"
            req.body, 
            { returnDocument: 'after', runValidators: true }
        );
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ taskNumber: req.params.id });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};