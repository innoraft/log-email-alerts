var Tail = require('always-tail');
var fs = require('fs');

var events = require('events');
var eventEmitter = new events.EventEmitter();

var fileArray=['im.log','im.1.log'];

var queue = {};
var nomoremails = false;
var timerset = false

eventEmitter.on('aline',  function(filename){
    timer(10000, filename);
    eventEmitter.on('time'+filename,  function(){
        eventEmitter.emit('sendmail'+filename);
//        eventEmitter.emit('nomoremails'+filename);
        nomoremails = true;
    });
    
    eventEmitter.on('enoughlines'+filename,  function(){
        eventEmitter.emit('sendmail'+filename);
//        eventEmitter.emit('nomoremails'+filename);
        nomoremails = true;
    });
    
    eventEmitter.on('sendmail'+filename,  function(){
        if(!nomoremails)
        {
        console.log("sendmail");
//        sendmail(subject, queue.toString(), function (data) {
//            waittime = new Date();
//            waittime.setMinutes(currentTime.getMinutes() + 120);
//            waitBitMore.setMinutes(waittime.getMinutes() + 1);
//            queue = [];
//        });
        timerset = false;
        timer(7200000, filename, true);
        }
    });   
    
    eventEmitter.on('enablemail'+filename,  function(){
        nomoremails = false;
    });
    
});

function timer(milisec, filename, fornomoremails)
{
    if(!fornomoremails)
    {
    setTimeout(function() {
        console.log('timer set');
        eventEmitter.emit('time'+filename);
        timerset = true;
    }, milisec);
    }
    else {
        setTimeout(function() {
            console.log('nomoreemails');
            //Some where here the "timeroff" event.on should do a break;
            eventEmitter.emit('enablemail'+filename);
        }, 30000);
    }
}

var subject='An alert for you';

for (var i = 0; i < fileArray.length; i++)
{
    queue[fileArray[i]] = new Array();
	watchit(fileArray[i],function(){
	});
}

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
    console.log("watchit");
	if (!fs.existsSync(filename)) fs.writeFileSync(filename, "");
	var tail = new Tail(filename, '\n');
	tail.on('line', function(data) {
        if(!nomoremails)
        {
            queue[filename].push(data);
            if(queue[filename].length>10)
            {
                eventEmitter.emit('enoughlines'+filename);
            }
            console.log(queue[filename]);
            if(!timerset)
            {
                eventEmitter.emit('aline', filename);
            }
        }
	});
	tail.on('error', function(data) {
  		console.log("error:", data);
	});
	tail.watch();
	callback();
}
