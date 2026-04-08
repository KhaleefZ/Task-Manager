const mongoose = require('mongoose');
const Counter = require('./Counter');

const taskSchema = new mongoose.Schema({
    taskNumber: { 
        type: String, 
        unique: true 
    },
    title: { 
        type: String, 
        required: [true, 'Title is required'], 
        trim: true 
    },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-increment logic: Runs before saving a new document
// models/Task.js

// Pre-save hook to handle auto-increment
taskSchema.pre('save', async function() { // REMOVED 'next' from here
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: 'task_sequence' },
                { $inc: { seq: 1 } },
                { returnDocument: 'after', upsert: true }
            );
            this.taskNumber = `Task ${counter.seq}`;
            // REMOVED next() from here
        } catch (error) {
            throw error; // Just throw the error instead of calling next(error)
        }
    }
    // REMOVED next() from here
});

module.exports = mongoose.model('Task', taskSchema);