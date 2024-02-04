const mongoose =  require('mongoose');
const Task = require("../models/task");
const  jwt = require("jsonwebtoken");
const storage = require('../utils/storage');
require ("dotenv").config();
exports.createtask = async (req,res)=>
{
    try{
        const{
            title,
            desc,
            dueDate,
            authtoken,
        } = req.body;
        if(
            !title ||
            !desc ||
            !dueDate ||
            !authtoken
        ){
            return res.status(403).send({
                success: false,
                message:"All fields are required",
            });
        }
        const existingTask = await Task.findOne({ title });
		if (existingTask) {
            const taskId = existingTask._id;
             storage.setTaskId(taskId);
              return res.json({
              taskId,
              message: "Task Title already exists with this name.",
    });

		}
        var decoded = jwt.verify(authtoken, process.env.JWT_SECRET_KEY);
        var userId = decoded.userId
        console.log(userId);
      const task = await Task.create({
        userid:userId,
        title:title,
        desc:desc,
        dueDate:dueDate,
        authtoken:authtoken,
    }); 
    const taskId = task._id;
    storage.setTaskId(taskId);
    return res.json({
        taskId,
    });
}
catch(error){
    console.error(error);
    return res.status(500).json({
        success:false,
        message:"Task can't be created Please try again",
    });
}

};
exports.getalltask = async(req,res)=>
{
    try{
      const result = await Task.find(req.query)
      .populate('userid');
      const sortedTasks = result.sort((a, b) => a.userid.priority - b.userid.priority);    
      res.status(200).json({result});

    }
    catch(error)
    {
        console.log(error);
    }
};




exports.updatetask = async(req,res)=>
{
    try{
      const updatedtask = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
      res.status(200).json({
        updatedtask,
      });
    }
    catch(error)
    {
        console.log(error);
    }
};


exports.deletetask = async (req, res) => {
    try {
        const filter = { _id: req.params.id }; // Assuming your task id is stored in req.params.id
        const deletedtask = await Task.softDelete(filter, req.body, { new: true, runValidators: true });
        
        res.status(200).json({
            deletedtask,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




