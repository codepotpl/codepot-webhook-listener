REQUIRED_ENVIRONMENT_VARIABLES = [
    'WEBHOOK_LISTENER_GITHUB_WEBHOOK_PORT',
    'WEBHOOK_LISTENER_SLACK_HOOK_TOKEN'
];
MISSING_VARIABLES = [];
REQUIRED_ENVIRONMENT_VARIABLES.forEach(function (variableName) {
    if (!process.env[variableName]) {
        MISSING_VARIABLES.push(variableName);
    }
});
if (MISSING_VARIABLES.length > 0) {
    var message = 'Missing environment variables: ' + MISSING_VARIABLES.join(', ');
    console.error(message);
    throw new Error(message);
}

process.env.TZ = 'Europe/Warsaw';

var gith = require('gith').create(process.env.WEBHOOK_LISTENER_GITHUB_WEBHOOK_PORT);
var execFile = require('child_process').execFile;
var nodeSlackr = require('node-slackr');

var slack = new nodeSlackr(process.env.WEBHOOK_LISTENER_SLACK_HOOK_TOKEN);

function sendMessageToSlack(message) {
    var formattedDate = '`' + new Date() + '`\n';
    var messages = {
        text: formattedDate + message,
        channel: '#builds'
    };
    slack.notify(messages, function (err, result) {
        if (!err) {
            console.log('Sent message: ');
            console.log(messages);
        } else {
            console.error('Something went wrong in sending message: ');
            console.error(err);
            console.error(messages);
        }
    });
}

sendMessageToSlack('*Siema Heniu - AWS-STAGING*');


var targets = [
    //{
    //    repo: 'codepotpl/codepot',
    //    branch: 'production',
    //    appName: 'WEBSITE PRODUCTION @ Tiktalik',
    //    script: './codepot-production.sh'
    //},
    {
        repo: 'codepotpl/codepot',
        branch: 'master',
        appName: 'WEBSITE STAGING @ AWS-STAGING',
        script: './codepot-staging.sh'
    },
    {
        repo: 'codepotpl/codepot-webclient',
        branch: 'master',
        appName: 'WEBCLIENT STAGING @ AWS-STAGING',
        script: './codepot-webclient-staging.sh'
    },
    //{
    //    repo: 'codepotpl/codepot-webclient',
    //    branch: 'production',
    //    appName: 'WEBCLIENT PRODUCTION @ Tiktalik',
    //    script: './codepot-webclient-production.sh'
    //},
    {
        repo: 'codepotpl/codepot-backend',
        branch: 'master',
        appName: 'BACKEND STAGING @ AWS-STAGING',
        script: './codepot-backend-staging.sh'
    },
    //{
    //    repo: 'codepotpl/codepot-backend',
    //    branch: 'production',
    //    appName: 'BACKEND PRODUCTION @ Tiktalik',
    //    script: './codepot-backend-production.sh'
    //}
];

targets.forEach(function (target) {
    gith({
        repo: target.repo,
        branch: target.branch
    }).on('all', function (payload) {
        var message = '------ *' + target.repo + ':' + target.branch + '* changed ------\nPusher: `' + payload.pusher + '`.\n\nBuilding and running new ' + target.appName;
        sendMessageToSlack(message);

        var startDate = new Date();
        execFile(target.script, function (error, stdout, stderr) {
            var message;
            if (!error) {
                message = '*' + target.appName + ' build complete! Hooray!*';
            } else {
                message = '*' + target.appName + ' build failed!*.\nMore info below:\n\n```' + error + '```';
                console.error('Something went wrong in ' + target.appName + ' build.');
                console.error(error);
            }
            sendMessageToSlack(target.appName + ' build time: `' + (new Date() - startDate) / 1000.0 + '`.\n' + message);
        });
    });
});