const express = require("express")
const router = express.Router()

const {
    createuser,
} = require("../Controller/user")

router.post("/createuser", createuser)

module.exports = router;