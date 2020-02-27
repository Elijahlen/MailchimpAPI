const express = require("express");
const parser = require("body-parser");
const app = express();
const https = require("https");
// const request = require("request");
const myParser = require("body-parser");
app.use(parser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));
// assume all your static file will be stored in public

app.get("/", (req,res)=>{
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", (req,res)=>{   // when a user enter the info;
  var firstName = req.body.f;// parse first
  var lastName = req.body.l;
  var email = req.body.e;
  // console.log(firstName);

  //preparing the url option and data
  var url = "https://us4.api.mailchimp.com/3.0/lists/150b4d02ad/members";
  var option = {
    auth: "elijah:ab2a8c53693bb3a40b52f9667cda47a6-us4",
    method:"POST",
  };
  var info = {     //the info to be sent to mailchimp in POST request
    email_address:email,
    status:"subscribed",
    merge_fields:{
      FNAME:firstName,
      LNAME:lastName
    }
  };
  info = JSON.stringify(info); // convert from js object to json

  // post the mailchimp with the user info
  var re = https.request(url, option, (response)=>{
    console.log(typeof(response));  // the response from mailchimp js an object
    // console.log(response); // tons of info
    console.log(Object.keys(response));  // tons of keys in object
// [
//   '_readableState',   'readable',
//   '_events',          '_eventsCount',
//   '_maxListeners',    'socket',
//   'connection',       'httpVersionMajor',
//   'httpVersionMinor', 'httpVersion',
//   'complete',         'headers',
//   'rawHeaders',       'trailers',
//   'rawTrailers',      'aborted',
//   'upgrade',          'url',
//   'method',           'statusCode',
//   'statusMessage',    'client',
//   '_consuming',       '_dumped',
//   'req'
// ]
    console.log(response.statusCode);   //get the statusCode to identify

    if(response.statusCode === 200){    //Be very carefully the type of the value
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    };

    response.on("data", (data)=>{   // get the data from the mailchimp
      console.log(JSON.parse(data));
      console.log(Object.keys(JSON.parse(data)));
    });
  });

  re.write(info);   //with the user info
  re.end();         //because we are using https.request re.end(); is a must
// res.write();
// res.send();         //means the end of the whole POST action the user will see the result
});

//mailchimp key
//ab2a8c53693bb3a40b52f9667cda47a6-us4
//list id
//150b4d02ad



app.listen(process.env.PORT||3000, function(){
  console.log("you have been a recipient of a workplace flirtation!");
});
