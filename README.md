# log-email-alerts

This is a node.js script which alerts on any new line occurrence in a log file.
We made this to use with PM2

User can customize the number of lines to send from the log file and also the delay between between two alerts.

##Setup
  1. ```rename sample._globals.js to _globals.js```
  2. ```change configuration accourding to your needs in _globals.js```
  3. run ```node log-email-alerts.js > log-email-alerts.log &```
