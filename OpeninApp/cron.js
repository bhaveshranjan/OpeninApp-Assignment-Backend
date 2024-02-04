const Task = require("./models/task");
const User = require("./models/user");
const cron =require('node-cron');
require("dotenv").config();
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var client = require('twilio')(accountSid,authToken);

const updatepriority = () => {
    try {
        cron.schedule('* * * * * *', async function () {
            //console.log("crone job");
            var tasks = await Task.find({})

            if (tasks.length > 0) {
                tasks.forEach(doc => {
                     id = doc._id;
                    var dueDateTimestamp = new Date(doc.dueDate).getTime();
                    var currentTimestamp = new Date().getTime();

                    var timeDifferenceInMilliseconds = dueDateTimestamp - currentTimestamp;
                    var timeDifferenceInDays = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)+1;

                    if (timeDifferenceInDays === 0) {
                         Task.findByIdAndUpdate(id, { priority: 0 }, { new: true, runValidators: true });
                        console.log("Updated successfully to priority 0",timeDifferenceInDays);
                    } else if (timeDifferenceInDays >= 1 && timeDifferenceInDays <= 2) {
                         Task.findByIdAndUpdate(id, { priority: 1 }, { new: true, runValidators: true });
                        console.log("Updated successfully to priority 1",timeDifferenceInDays);
                    } else if (timeDifferenceInDays >= 3 && timeDifferenceInDays <= 4) {
                         Task.findByIdAndUpdate(id, { priority: 2 }, { new: true, runValidators: true });
                        console.log("Updated successfully to priority 2",timeDifferenceInDays);
                    } else if (timeDifferenceInDays >= 5) {
                         Task.findByIdAndUpdate(id, { priority: 3 }, { new: true, runValidators: true });
                        console.log("Updated successfully to priority 3",timeDifferenceInDays);
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const calltwillio = () =>{
    try {
        cron.schedule('* * * * * *', async function () {
            //console.log("crone job");
            var tasks = await Task.find({}).populate('userid');
            tasks.sort((a, b) => a.userid.priority - b.userid.priority);    
          //  console.log("In cron")
            if (tasks.length > 0) {
                tasks.forEach(doc => {
                     id = doc._id;
                    var dueDateTimestamp = new Date(doc.dueDate).getTime();
                    var currentTimestamp = new Date().getTime();

                    var timeDifferenceInMilliseconds = dueDateTimestamp - currentTimestamp;
                    var timeDifferenceInDays = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
                   // console.log(timeDifferenceInDays);
                    if(timeDifferenceInDays<0){
                        var users =[];
                        tasks.map((key)=>{
                            users.push(key.userid);
                        });
                        const userphone = users[0].phone;
                       // console.log(userphone);
                        console.log(users);
                        client.calls.create({
                            url  : 'http://demo.twilio.com/docs/voice.xml',
                            to : userphone,
                            from :'+16593007585'
                        },function(err,call){
                            if(err){
                                console.log(err);
                            }else{
                                console.log(call.sid);
                            }
                        }
                        );
                    //console.log(users);
                    }
                });
            }
        });

 
    }
     catch (error) {
        console.log(error);
    }
}


module.exports ={
   // updatepriority,
    calltwillio
}