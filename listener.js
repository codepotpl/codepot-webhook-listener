REQUIRED_ENVIRONMENT_VARIABLES = [
    'GITHUB_WEBHOOK_PORT',
    'SLACK_HOOK_TOKEN'
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

var gith = require('gith').create(process.env.GITHUB_WEBHOOK_PORT);
var execFile = require('child_process').execFile;
var nodeSlackr = require('node-slackr');

var slack = new nodeSlackr(process.env.SLACK_HOOK_TOKEN);

function sendMessageToSlack(message) {
    var formattedDate = '`' + new Date() + '`\n';
    var messages = {
        text: formattedDate + message,
        channel: '#builds'
    }
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

sendMessageToSlack('*Siema Heniu*');

gith({
    repo: 'codepotpl/codepot',
    branch: 'production'
}).on('all', function (payload) {
    var message = '*Production changed*.\nPusher: `' + payload.pusher + '`.\n\nBuilding and running new production image...';
    sendMessageToSlack(message);

    var startDate = new Date();
    execFile('./codepot-production.sh', function (error, stdout, stderr) {
        var message;
        if (!error) {
            message = '*Production build complete! Hooray!*';
        } else {
            message = '*Production build failed!*.\nMore info below:\n\n```' + error + '```';
            console.error('Something went wront in production docker build.');
            console.error(error);
        }
        sendMessageToSlack('Production build time: `' + (new Date() - startDate) / 1000.0 + '`.\n' + message);
    });
});

gith({
    repo: 'codepotpl/codepot',
    branch: 'master'
}).on('all', function (payload) {
    var message = '*Master changed*.\nPusher: `' + payload.pusher + '`.\n\nBuilding and running new staging image...';
    sendMessageToSlack(message);

    var startDate = new Date();
    execFile('./codepot-staging.sh', function (error, stdout, stderr) {
        var message;
        if (!error) {
            message = '*Staging build complete! Hooray!*';
        } else {
            message = '*Staging build failed!*.\nMore info below:\n\n```' + error + '```';
            console.error('Something went wront in staging docker build.');
            console.error(error);
        }
        sendMessageToSlack('Staging build time: `' + (new Date() - startDate) / 1000.0 + '`.\n' + message);
    });
});

gith({
    repo: 'codepotpl/codepot-webclient',
    branch: 'master'
}).on('all', function (payload) {
    var message = '*CODEPOT WEBCLIENT Master changed*.\nPusher: `' + payload.pusher + '`.\n\nBuilding and running new staging image...';
    sendMessageToSlack(message);

    var startDate = new Date();
    execFile('./codepot-webclient-staging.sh', function (error, stdout, stderr) {
        var message;
        if (!error) {
            message = '*Staging build complete! Hooray!*';
        } else {
            message = '*Staging build failed!*.\nMore info below:\n\n```' + error + '```';
            console.error('Something went wront in staging docker build.');
            console.error(error);
        }
        sendMessageToSlack('Staging build time: `' + (new Date() - startDate) / 1000.0 + '`.\n' + message);
    });
});

gith({
    repo: 'codepotpl/codepot-backend',
    branch: 'master'
}).on('all', function (payload) {
    var message = '*CODEPOT BACKEND Master changed*.\nPusher: `' + payload.pusher + '`.\n\nBuilding and running new staging image...';
    sendMessageToSlack(message);

    var startDate = new Date();
    execFile('./codepot-backend-staging.sh', function (error, stdout, stderr) {
        var message;
        if (!error) {
            message = '*Staging build complete! Hooray!*';
        } else {
            message = '*Staging build failed!*.\nMore info below:\n\n```' + error + '```';
            console.error('Something went wront in staging docker build.');
            console.error(error);
        }
        sendMessageToSlack('Staging build time: `' + (new Date() - startDate) / 1000.0 + '`.\n' + message);
    });
});