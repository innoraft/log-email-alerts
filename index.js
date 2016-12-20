var Tail = require('always-tail');
var fs = require('fs');
var events = require('events');
var nodemailer = require('nodemailer');

function logEmailAlerts (config) {
    var eventEmitter = new events.EventEmitter()
    var queue = {};
    var nomoremails = {}; //false;
    var timerset = {}; //false
    var alerts_to_email = (config.alerts_to_email)? config.alerts_to_email : "someone@example.com"
        ,alerts_from_email = (config.alerts_from_email)? config.alerts_from_email :  "someone@example.com"
        ,no_more_emails_till_mili_sec = (config.no_more_emails_till_mili_sec)? config.no_more_emails_till_mili_sec :  7200000
        ,collect_lines_till_mili_sec = (config.collect_lines_till_mili_sec)? config.collect_lines_till_mili_sec :  10000
        ,max_lines_to_collect = (config.max_lines_to_collect)? config.max_lines_to_collect :  10 ;
    for (var i = 0; i < config.file_array.length; i++)
    {
        queue[config.file_array[i]] = new Array();
        nomoremails[config.file_array[i]] = false;
        timerset[config.file_array[i]] = false;
        watchit(config.file_array[i],function(){
            console.log("Watching "+config.file_array[i]);
        });
    }
    function timer(milisec, filename, fornomoremails)
    {
        if(!fornomoremails)
        {
            timerset[filename] = true;
            console.log('timer set');
            setTimeout(function() {
                eventEmitter.emit('time'+filename);
            }, milisec);
        }
        else 
        {
            console.log('nomoreemails timer set');
            setTimeout(function() {
                eventEmitter.emit('enablemail'+filename);
            }, milisec);
        }
    }
    function watchit(filename,callback)
    {
        console.log("watchit");
        if (!fs.existsSync(filename)) fs.writeFileSync(filename, "");
        var tail = new Tail(filename, '\n');
        tail.on('line', function(data) {
            if(!nomoremails[filename])
            {
                queue[filename].push(data);
                if(queue[filename].length>max_lines_to_collect)
                {
                    eventEmitter.emit('enoughlines'+filename);
                }
                console.log(queue[filename]);
                console.log("timerset is "+timerset[filename])
                if(!timerset[filename])
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
    function sendmail(subject,text,callback){
    	var transporter = nodemailer.createTransport({
    	       	host: "localhost",
            	port : "25",
    	});
     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
        var mailOptions = {
            from: alerts_from_email, // sender address 
            to: alerts_to_email, // list of receivers 
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
    eventEmitter.on('aline',  function(filename){
        timer(collect_lines_till_mili_sec, filename, false);
        eventEmitter.on('time'+filename,  function(){
            eventEmitter.emit('sendmail'+filename);
            nomoremails[filename] = true;
        });

        eventEmitter.on('enoughlines'+filename,  function(){
            eventEmitter.emit('sendmail'+filename);
            nomoremails[filename] = true;
        });

        eventEmitter.on('sendmail'+filename,  function(){
            if(!nomoremails[filename])
            {
                console.log("sendmail for "+filename);
                console.log(queue[filename].toString());
                sendmail("Some error occured in "+filename, queue[filename].toString(), function (data) {
                });
                queue[filename] = [];
                timerset[filename] = false;
                timer(no_more_emails_till_mili_sec, filename, true);
            }
        });   

        eventEmitter.on('enablemail'+filename,  function(){
            nomoremails[filename] = false;
        });

    });
}

module.exports = logEmailAlerts;
