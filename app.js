//jshint esversion: 6
const client = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { STATUS_CODES } = require("http");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

// app.use(express.static('public'));
app.use(express.static(__dirname));

client.setConfig({
  apiKey: "6ffd9a9bfba37b87e01f7657f1feae43-us8",
  server: "us8",
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const email = req.body.email;
  const firstName = req.body.Fname;
  const Lastname = req.body.Lname;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {

          FNAME: firstName,
          LNAME: Lastname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us8.api.mailchimp.com/3.0/lists/23d7fc0104";
  const options = {
    method: "POST",
    auth: "dummy:6ffd9a9bfba37b87e01f7657f1feae43-us8",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode ===200){
        res.sendFile(__dirname + "/success.html");
    }
    else{
        res.sendFile(__dirname + "/fail.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
      
    });
  });
  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function () {
 
    console.log('server is running on port 3000');
 
});
