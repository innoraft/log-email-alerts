var Tail = require('always-tail');
var fs = require('fs');
if (!fs.existsSync(filename)) fs.writeFileSync(filename, "");

var tail = new Tail(filename, '\n');

var filename='/path/to/file.log';
var subject='An alert for you';

function sendmail(subject,text,callback){

	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport({
	       	host: "localhost",
        	port : "25",
	});
 process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
	var mailOptions = {
	    from: 'from@domain.com', // sender address 
	    to: 'to@domain.com', // list of receivers 
	    subject: subject, // Subject line 
	    text: text, // plaintext body 
	    html: ''
	};
	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        callback(error);
	    }
	    else
	    	callback('Message sent: ' + info.response);
	});
}

tail.on('line', function(data) {
  sendmail(subject,data,function(data){console.log(data)});
});
tail.on('error', function(data) {
  console.log("error:", data);
});
tail.watch();
