var Tail = require('always-tail');
var fs = require('fs');
//add the file names here ! 
var fileArray=['im.log','im.log.1','im.log.2','im.log.3','im.log.4'],
	subject='An alert for you';
	var queue=new Array();
	var waittime = new Date();
	var waitBitMore= new Date();
	waitBitMore.setMinutes(waittime.getMinutes()+1);
for (var i = 0; i < fileArray.length; i++) {
	watchit(fileArray[i],function(){

	});
};
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

function watchit(filename,callback)
{
	
	if (!fs.existsSync(filename)) fs.writeFileSync(filename, "");
	var tail = new Tail(filename, '\n');
	tail.on('line', function(data) {
//		console.log(queue.length);
		queue.push(data);
		var currentTime = new Date();
		if((queue.length > 10 || waitBitMore < currentTime) && (waittime <  currentTime))
		{
			sendmail(subject,queue.toString(),function(data){
				waittime=new Date();
				waittime.setMinutes(currentTime.getMinutes()+120);
				waitBitMore.setMinutes(waittime.getMinutes()+1);
				queue = [];
//				console.log("I will be back " +data +currentTime+" " + waittime);
			});
			
		}
	});
	tail.on('error', function(data) {
  		console.log("error:", data);
	});
	tail.watch();
	callback();
}
