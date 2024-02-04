// Import the SubTask model
const SubTask = require('../models/subtask');
const Task = require("../models/task");
const storage = require('../utils/storage');


// Controller function for creating a subtask
exports.createsubtask = async (req, res) => {
  try {
    const taskId = storage.getTaskId();
    const {status} = req.body;
    
    // Use the provided taskId to link the subtask to the corresponding task
    const newSubTask = await SubTask.create({ task_id: taskId, status });
    
    res.json(newSubTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.getallsubtask = async(req,res)=>
// {
//     try{
      
//       const result = await SubTask.find(req.query).populate('task_id');
//       const counts = { status0: 0, status1: 0 };
//       result.forEach(doc => {
//         if (doc.status === 0) {
//           counts.status0++;
//         } else if (doc.status === 1) {
//           counts.status1++;
//         }
//       });
//       const totalcount = counts.status0 + counts.status1;

//       if(counts.status1 == 0)
//       {
//         Task.findByIdAndUpdate(req.params.id, {status:'TODO'},{new:true,runValidators:true});
//       }
//       else if(counts.status1 >=1)
//       {
//         Task.findByIdAndUpdate(req.params.id, {status:'IN_PROGRESS'},{new:true,runValidators:true});
//       }
//       else if(counts.status1 == totalcount)
//       {
//         Task.findByIdAndUpdate(req.params.id, {status:'DONE'},{new:true,runValidators:true});
//       }
//       res.status(200).json({result,counts});

//     }
//     catch(error)
//     {
//         console.log(error);
//     }
// };


exports.getallsubtask = async (req, res) => {
    try {
      const result = await SubTask.find({ task_id: req.query.task_id }).populate('task_id');
      const counts = { status0: 0, status1: 0 };
  
      result.forEach(doc => {
        if (doc.status === 0) {
          counts.status0++;
        } else if (doc.status === 1) {
          counts.status1++;
        }
      });
  
      const totalcount = counts.status0 + counts.status1;
  
      let statusToUpdate = '';
  
      if (counts.status1 === 0) {
        statusToUpdate = 'TODO';
      } else if (counts.status1 >= 1 && counts.status1 < totalcount ) {
        statusToUpdate = 'IN_PROGRESS';
      } else if (counts.status1 === totalcount) {
        statusToUpdate = 'DONE';
      }
      console.log("total count",totalcount);
  
      // Check if the task exists
      const existingTask = await Task.findOne({ _id: req.query.task_id });
  
      if (!existingTask) {
        console.log(`Task with ID ${req.query.task_id} not found`);
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Update the task and save it to the database
      existingTask.status = statusToUpdate;
      const updatedTask = await existingTask.save();
  
      console.log(`Task with ID ${req.query.task_id} successfully updated`);
  
      res.status(200).json({ result, counts, updatedTask });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
  

exports.updatesubtask = async(req,res)=>
{
    try{
      const updatedsubtask = await SubTask.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
      res.status(200).json({
        updatedsubtask,
      });
    }
    catch(error)
    {
        console.log(error);
    }
};

exports.deletesubtask = async (req, res) => {
    try {
        const filter = { _id: req.params.id }; // Assuming your task id is stored in req.params.id
        const deletedsubtask = await SubTask.softDelete(filter, req.body, { new: true, runValidators: true });
        
        res.status(200).json({
            deletedsubtask,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
