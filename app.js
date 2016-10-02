const config = require(`./config.json`);
const axios = require(`axios`);
const Adapters = require(`./adapters`);
const _ = require(`lodash`);

module.exports = {
	talkToSlack: function(request) {
		console.log('=== start upsource webhook payload ===')
		console.log(JSON.stringify(request, false, 4));
		console.log('=== end upsource webhook payload ===')

		const adapter = Adapters[request.dataType];

		if (_.isUndefined(adapter)) {
			console.log(`No adapter has been registered for the event ${request.dataType}`);
			return;
		}

		var reviewIdDTO = {
			projectId: request.projectId,
			reviewId: request.data.base.reviewId
		}
		
		// fetch review details, because the webhook request does not have review title
		// note: we want the review title, not the revision commit description
		var reviewDetailsUrl = config.upsourceUrl + '/~rpc/getReviewDetails'
		var reviewRequest = axios.post(reviewDetailsUrl, reviewIdDTO).then(function(response) {
			var review = response.data.result;
			var slackRequest = adapter(request, review, config);
			console.log('=== start slack webhook payload ===');
			console.log(JSON.stringify(slackRequest, false, 4));
			console.log('=== end slack webhook payload ===');
			axios.post(config.slackWebhookUrl, slackRequest);
		});
	}
};

