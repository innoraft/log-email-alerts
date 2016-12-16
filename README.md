# log-email-alerts

This is a node.js package which alerts on any new line occurrence in a log file (or any text file).
Its use cases be - getting notified for an error or warning occurance in your log file on some server or sending report from a file when a new data is added. In our case we mostly used it with PM2 to alert us whenever a script fails.

User can customize the number of lines to send from the log file and also the delay between between two alerts.

##Setup
  1. do `npm install log-email-alerts`.
  2. `require` the module in your app.
  3. set configuration as your desire as a JSON.
  4. call the function with config as a parameter.

##Example
  
````Javascript
    var logEmailAlerts = require('log-email-alerts');
    var config = {
        file_array : ['abc.log', '/var/some/thing.log']
        ,alerts_to_email : "someone@example.com"
        ,alerts_from_email : "someone@example.com"
        ,no_more_emails_till_mili_sec:7200000
        ,collect_lines_till_mili_sec:10000
        ,max_lines_to_collect:10
    };
    logEmailAlerts(config);
````

##Settings
Following are the things that you can set in the config object.
* `file_array` : This array contains path to the log files for which you want to set alert.
* `alerts_to_email` : It is the email to which alerts are send.
* `alerts_from_email` : It is the email which is used in from field of the sent mails.
* `no_more_emails_till_mili_sec` : How much delay do you want in between alerts. Useful in case your files gets suddenly flooded.
* `collect_lines_till_mili_sec` : Ones a new line occurs in file then for how many mili seconds should the program keep on collecting the lines before it sends them in an alert.
* `max_lines_to_collect` : How many minimum number of lines should the program collect before sending an alert.