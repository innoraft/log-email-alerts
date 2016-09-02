# log-email-alerts

This is a node.js script which alerts on any new line occurrence in a log file.
We made this to use with PM2

User can customize the number of lines to send from the log file and also the delay between between two alerts.

##Setup
  1. ```rename sample._globals.js to _globals.js```
  2. ```change configuration accourding to your needs in _globals.js```
  3. run ```node logEmailAlerts.js > log-email-alerts.log &```

##Settings
Following are the things that you can change from `_globals.js` file
* `fileArray` : This array contains path to the log files for which you want to set alert.
* `alertsToEmail` : It is the email to which alerts are send.
* `alertsFromEmail` : It is the email which is used in from field of the sent mails.
* `noMoreEmailsTillMiliSec` : How much delay do you want in between alerts. 
* `seekLinesTillMiliSec` : Ones a new line occurs in file then for how many mili seconds should the program keep on collecting the lines before it sends them in an alert.
* `seekTimeTillLines` : How many number of lines should I collect minimum before sending an alert.