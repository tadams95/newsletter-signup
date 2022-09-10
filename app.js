const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
const app = express();

//provides path of static files (css and images) so styles and images run on a server
app.use(express.static('public'));

//use body parser to get data user inputs to body of website
app.use(bodyParser.urlencoded({extended: true}));


//get method to use the home route, specify to send response to /signup.html
//essentially get's user input
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //creates json of user inputted info on newsletter submission
    //formatted to mailchimp api docs, https://mailchimp.com/developer/marketing/api/list-activity/ 
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                object: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //strigifies above data
    let jsonData = JSON.stringify(data);

    //URL and data center inputted data will be sent to
    const url = "https://us3.api.mailchimp.com/3.0/lists/3e6b508f81";

    //setting post method to Mailchimp server
    const options = {
        method: "POST",
        auth: "tyrelle1:c81494f47ca9625bee2a575b7ec16ddc-us3"
    }

    //console log inputted data as a check that code works
    const request = https.request(url, options, function(response) {
        response.on("data", function(data){
            console.log(JSON.parse(data));

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        });
    });

    //passing data to Mailchimp server
    request.write(jsonData);
    //end request
    request.end();

});

//redirect user from failure page back to the home page
app.post("/failure", function(req, res) {
    res.redirect("/");
});

//listen function notifying user the server is up
app.listen(process.env.PORT || 3000, function() {
    console.log("Server up and running.");
});

//API Key
// c81494f47ca9625bee2a575b7ec16ddc-us3

//Audience ID: 3e6b508f81