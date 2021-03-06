# upsource-slack-api-adapter
Transforms Upsource webhooks to Slack compatible requests

## Upsource events currently supported
* ReviewCreatedFeedEventBean
* ReviewStateChangedFeedEventBean
* ParticipantStateChangedFeedEventBean
* NewParticipantInReviewFeedEventBean
* DiscussionFeedEventBean

## Requirements
Tested to run on NodeJS 6. Other versions may be supported.

## Configuration
The Slack webhook end point needs to be provided in config.json in the following format:
```
{
  "slackWebhookUrl": "link-to-slack-webhook"
}
```
Save this file in the root directory of the project.
See `sample.config.json` for an example.

The application runs on port 4000. Redirect Upsource webhook to this address.

## Running the adapter
Install npm dependencies by running `npm install`
Start the application by executing `npm start`

![Screenshot](slack-upsource.png)
