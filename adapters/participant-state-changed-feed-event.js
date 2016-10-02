const _ = require('lodash');
const adapterHelper = require('./adapter-helper');

module.exports = function(review) {
        const author = _.get(request, 'data.base.actor.userName', '');
        const reviewers = adapterHelper.getReviewers(request);
	const reviewState  = {
		0: 'Open',
		1: 'Closed'
	};

	const color = (function() {
		if (review.data.newState === 0) return '#F35A00';

		return '#2AB27B'
	});

	return {
		text: `Review #${request.data.base.requestNumber}: Participant state changed from ${requestState[request.data.oldState]} to ${requestState[request.data.newState]}`,
		attachments: [
			{
                                title: `[${request.data.base.reviewId}] ${review.title}`,
                                title_link: adapterHelper.getReviewUrl(request),
                                author_name: 'Participant State Changed',
				fallback: `Review #${request.data.base.reviewNumber}: Participant state changed from ${reviewState[request.data.oldState]} to ${reviewState[request.data.newState]}`,
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
				color: '#2AB27B'
			}
		]
	}
};
