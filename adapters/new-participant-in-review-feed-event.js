const _ = require('lodash');
const adapterHelper = require('./adapter-helper');

module.exports = function(review) {
	const reviewers = adapterHelper.getReviewers(request);

	return {
		text: `Review #${review.data.base.reviewNumber}: Participants changed`,
		attachments: [
			{
				fallback: `Review #${review.data.base.reviewNumber}: Participants changed`,
				fields: [
					{
						title: 'Project',
						value: review.projectId,
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
