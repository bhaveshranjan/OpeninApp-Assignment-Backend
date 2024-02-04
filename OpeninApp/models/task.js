const mongoose = require("mongoose");
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const User = require("../models/user")
const taskSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    dueDate:{
        type: Date,
        required: true,
    },
    status:{
        type: String,
        enum:['TODO','IN_PROGRESS', 'DONE'],
        default:'TODO',
    },
    authtoken:{
        type: String,
        required: true,
    },
    priority:{
        type: Number,
        enum:[0,1,2,3,4,5],
    },
    
}
);
taskSchema.plugin(softDeletePlugin);
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;