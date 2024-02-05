const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const taskRoutes = require("./Routes/task");
const userRoutes = require("./Routes/user");
const subtaskRoutes = require("./Routes/subtask");

const database = require("./config/database");

const PORT = process.env.PORT || 4000;

database.connect();
app.use(express.json());
app.use(bodyParser.json());
const cron = require("./cron");
cron.updatepriority();
cron.calltwillio();
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/subtask", subtaskRoutes);


app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:'Your server is running '
    });
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
