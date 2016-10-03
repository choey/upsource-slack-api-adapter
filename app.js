const config = require(`./config.json`);
const axios = require(`axios`);
const Adapters = require(`./adapters`);
const _ = require(`lodash`);

module.exports = (function () {
	var addUserInfoToFooter = function (slackRequest, userInfo) {
		// adapter-helper#fetchAvatarLink's callback invoation sets userAvatar
		return function (userAvatar) {
			slackRequest.username = _.get(config, 'botName', 'Upsource Bot');
			slackRequest.icon_emoji = _.get(config, 'botAvatar', ':squirrel:');
			slackRequest.attachments[0].footer = userInfo.name;
			slackRequest.attachments[0].footer_icon = userAvatar;
			console.log('=== start slack webhook payload ===');
			console.log(JSON.stringify(slackRequest, false, 4));
			console.log('=== end slack webhook payload ===');
			return {
				then: function (callback) {
					return callback(slackRequest);
				}
			}
		}
	};

	var postToSlack = function (slackRequest) {
		console.log(`Calling Slack @ ${config.slackWebhookUrl}`);
		axios({
			method: 'post',
			url: config.slackWebhookUrl,
			data: slackRequest
		}).catch(function (e) {
			console.error("Failed to call Slack", e);
		});
	};

	var handleUpsourceHook = function (request) {
		console.log('=== start upsource webhook payload ===');
		console.log(JSON.stringify(request, false, 4));
		console.log('=== end upsource webhook payload ===');

		const adapter = Adapters[request.dataType];

		if (_.isUndefined(adapter)) {
			console.log(`No adapter has been registered for the event ${request.dataType}`);
			return;
		}

		var reviewIdDTO = {
			projectId: request.projectId,
			reviewId: request.data.base.reviewId
		}

		// prepare to fetch review details, because the webhook request does not have review title
		// note: we want the review title, not the revision commit description
		var reviewDetailsUrl = config.upsourceUrl + '/~rpc/getReviewDetails';
		var getReviewDetails = axios.post(reviewDetailsUrl, reviewIdDTO);

		// prepare to fetch user info (i.e., the "actor" of this transaction)
		// note: avatar link may be a redirect, which must be followed for Slack to render
		var userInfoUrl = config.upsourceUrl + '/~rpc/getUserInfo';
		var getUserInfo = axios.post(userInfoUrl, { ids: Adapters.helper.getActor(request).userId });

		// chain everything together and call Slack in the end
		axios.all([getReviewDetails, getUserInfo])
			.then(axios.spread(function (reviewResponse, userInfoResponse) {
				var review = reviewResponse.data.result;
				var userInfo = userInfoResponse.data.result.infos[0];
				var slackRequest = adapter(request, review, userInfo, config);
				var fetchAvatar = Adapters.helper.fetchAvatarLink(userInfo)
					.then(addUserInfoToFooter(slackRequest, userInfo))
					.then(postToSlack);
			}
			));
	};

	return { talkToSlack: handleUpsourceHook };
})();