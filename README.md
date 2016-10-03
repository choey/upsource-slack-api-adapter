# upsource-slack-api-adapter
Transforms Upsource webhooks to Slack compatible requests

## Upsource events currently supported
* ReviewCreatedFeedEventBean
* ReviewStateChangedFeedEventBean
* -ParticipantStateChangedFeedEventBean- (under construction)
* NewParticipantInReviewFeedEventBean
* DiscussionFeedEventBean

## Requirements
Tested to run on NodeJS 6. Other versions may be supported.

## Configuration
The Upsource base url and Slack webhook endpoint need to be provided in config.json in the following format:
```
{
	"listenPort": 4000,
	"upsourceUrl": "link-to-upsource",
	"slackWebhookUrl": "link-to-slack-webhook",
	"botName": "Upsource Bot",
	"botAvatar": ":squirrel:"
}
```
Save this file in the root directory of the project.
See `sample.config.json` for an example.

The application runs on port 4000 by default. Redirect Upsource webhook to this address.

## Running the adapter
Install npm dependencies by running `npm install`
Start the application by executing `npm start`

![Screenshot](slack-upsource.png)
(TODO: update screenshot)
