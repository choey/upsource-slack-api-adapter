const _ = require('lodash');
const adapterHelper = require('./adapter-helper');
const reviewState = {
	0: 'Open',
	1: 'Closed'
};

module.exports = function (request, review, userInfo, config) {
	const author = adapterHelper.getActor(request);
	const reviewers = adapterHelper.getReviewers(request);
	const oldState = reviewState[request.data.oldState];
	const newState = reviewState[request.data.newState];
	const color = newState == 'Open' ? '#F35A00' : '#2AB27B';
	const message = (function () {
		// if the review state _changed_ and is now [Open], then it must not have been [Open] previously
		// and therefore will always considered [Reopened].
		if (newState == 'Open')
			return 'Issue Reopened';

		if (newState == 'Closed')
			return 'Issue Closed'

		return newState;
	});

	return {
		attachments: [
			{
				title: `[${request.data.base.reviewId}] ${review.title}`,
				title_link: adapterHelper.getReviewUrl(request),
				author_name: message(),
				fallback: `[${request.data.base.reviewId}] Review state changed from ${reviewState[request.data.oldState]} to ${reviewState[request.data.newState]}`,
				fields: [
					{
						title: 'Old State',
						value: `_${reviewState[request.data.oldState]}_`,
						short: true
					},
					{
						title: 'New State',
						value: `_${reviewState[request.data.newState]}_`,
						short: true
					},
					{
						title: 'Reviewer(s)',
						value: reviewers.join(', '),
						short: true
					}
				],
				mrkdwn_in: ['fields'],
				color: color
			}
		]
	}
};
