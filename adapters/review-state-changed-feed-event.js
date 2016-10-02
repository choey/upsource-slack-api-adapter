const _ = require('lodash');
const adapterHelper = require('./adapter-helper');

module.exports = function(request, review, config) {
	const author = adapterHelper.getActor(request);
        const reviewers = adapterHelper.getReviewers(request);
	const reviewState  = {
		0: 'Open',
		1: 'Closed'
	};

	const color = (function() {
		if (request.data.newState === 0) return '#F35A00';

		return '#2AB27B'
	});

	return {
		mrkdown: true,
		attachments: [
			{
                                title: `[${request.data.base.reviewId}] ${review.title}`,
                                title_link: `http://${config.upsourceUrl}/${review.projectId}/review/${request.data.base.reviewId}`,
                                author_name: `Review State Changed by ${author}`,
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
				color: color()
			}
		]
	}
};
