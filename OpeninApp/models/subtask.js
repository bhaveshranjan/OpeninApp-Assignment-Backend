const mongoose = require("mongoose");
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const User = require("../models/user")
const Task = require("..//models/task")
const subtaskSchema = new mongoose.Schema({
    task_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Task',
        required: true,
       
    },
    status:{
        type: Number,
        required: true,
        enum:{
            values:[0,1],
            message:`{VALUE} is not valid`,
        },
    },
    deletedAt:{
        type: Date,
    },
}
,
{
    timestamps:true
});
subtaskSchema.plugin(softDeletePlugin);
const SubTask = mongoose.model("SubTask", subtaskSchema);

module.exports = SubTask;