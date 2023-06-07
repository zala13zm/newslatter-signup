const express = require('express')
const bodyParser = require('body-parser')
const https = require("https")
const request = require("request")
const mailchimp = require('@mailchimp/mailchimp_marketing')



const app = express()


var apiKey = "5cd4de80000e12e42c475f3b66d4645c-us13"
var audienceID = "1e99678a14"

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
  })

app.post('/', (req, res) => {
  var firstNamee = req.body.FirstName;
  var lastNamee = req.body.LastName;
  var emaile = req.body.Email;
  
  const subscribingUser = {
    firstName: firstNamee,
    lastName: lastNamee,
    email: emaile
  };


    async function run() {
        const response = await mailchimp.lists.addListMember(audienceID, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        console.log(`Sucessfully added contact as an audience member. The contact's id is ${response.id}.`);
    }
    
    run();
  
  const response = `
    <script>
      alert('Form submitted successfully!');
      window.location.href = '/'; // Redirect to homepage after displaying the alert
    </script>
  `;
  res.send(response);
});



mailchimp.setConfig({
  apiKey: apiKey,
  server: "us13",
});



async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Example app listening on port 3000`)
  })