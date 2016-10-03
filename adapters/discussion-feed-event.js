const _ = require('lodash');
const adapterHelper = require('./adapter-helper');

module.exports = function (request, review, userInfo, config) {
	const reviewers = adapterHelper.getReviewers(request);
	const actor = adapterHelper.getActor(request);
	console.log(`=== start user info for [${actor.userId}] ===`);
	console.log(JSON.stringify(userInfo, false, 4));
	console.log(`=== end user info for [${actor.userId}] ===`);

	return {
		parse: 'full',
		attachments: [
			{
				title: `[${request.data.base.reviewId}] ${review.title}`,
				title_link: adapterHelper.getReviewUrl(request),
				author_name: 'New Comment',
				fallback: `[New comment by ${actor.userName} on [${request.data.base.reviewId}]`,
				fields: [
					{
						title: 'Comment',
						value: adapterHelper.sanitizeForSlack(request.data.commentText)
					},
					{
						title: 'Reviewer(s)',
						value: reviewers.join(', '),
						short: true
					}
				],
				mrkdwn_in: ['fields'],
				color: '#3AA3E3'
			}
		]
	}
};
