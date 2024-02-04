const express = require("express")
const router = express.Router()

const {
    createtask,updatetask, deletetask, getalltask
} = require("../Controller/task")

router.post("/createtask", createtask)

router.get("/getalltask",getalltask)

//router.delete("/deletetask",deletetask)

router.route('/:id')
     .patch(updatetask)
     .delete(deletetask)

module.exports = router;