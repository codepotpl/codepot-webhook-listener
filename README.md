# Codepot GitHub Webhook Listener

## Setup:
1. Go to project's webhook settings (eg. `https://github.com/codepotpl/codepot/settings/hooks/new`).
2. Set valid `Payload URL`, `Content type` to `application/x-www-form-urlencoded`.
3. Set trigger action to push only.

## Running:
1. Install node stuff: `npm install`.
2. Run: `WEBHOOK_LISTENER_GITHUB_WEBHOOK_PORT=<PORT> WEBHOOK_LISTENER_SLACK_HOOK_TOKEN=<TOKEN> node_modules/.bin/forever start listener.js`
