const express = require("express")
const router = express.Router()

const {
    createsubtask,getallsubtask, updatesubtask,deletesubtask} = require("../Controller/subtask")

router.post("/createsubtask", createsubtask)

router.get("/getallsubtask",getallsubtask)

router.route('/:id')
     .patch(updatesubtask)
     .delete(deletesubtask)

module.exports = router;