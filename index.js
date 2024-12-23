const express = require('express');
const nodemailer = require('nodemailer');
const request = require('request');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

// configure the middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

// define the route for sending emails
app.post('/send-email', (req, res) => {
    // create a transporter object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'career2010compass@gmail.com',
            pass: 'hxvy dzvd bkpq uhyo'
        }
    });

    let html = `<h1>I am <em>${req.body.name}</em></h1>
                <h3>Email: ${req.body.email}</h3>
                <p>${req.body.message}</p
                >`;
    // define the email options
    const mailOptions = {
        from: req.body.email,
        to: 'career2010compass@gmail.com',
        subject: req.body.subject,
        // text: req.body.text
        html
    };

    // send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

app.get("/courses/:course",async (req,res) => {
    let url = `https://www.collegesearch.in/${req.params.course}-colleges-india`;
   
    request(url,(error,response,html)=>{
        if(error){
            res.status(500).send({"error": "Can't find courses now!! Please try after sometime!!"});
            return;
        } 
        let $ = cheerio.load(html);
        let rows = $('#listing li');
        
        let contents = [];
        rows.each(function(i,row){
            let data = $(row).data();
            if(Object.keys(data).length !== 0) contents.push($(row).data());
        })
        
        if(contents.length == 0) res.status(500).send({"error": "Can't find courses now!! Please try after sometime!!"});
        else res.status(200).send(contents);

    })
});

// start the server
app.listen(3000, () => {
    console.log('Server started on port http://localhost:3000');
});
