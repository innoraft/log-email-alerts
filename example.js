var logEmailAlerts = require('./logEmailAlerts');

var config = {
    file_array : ['abc.log']
    ,alerts_to_email : "someone@example.com"
    ,alerts_from_email : "someone@example.com"
    ,no_more_emails_till_mili_sec:7200000
    ,collect_lines_till_mili_sec:10000
    ,max_lines_to_collect:10
};

logEmailAlerts(config);