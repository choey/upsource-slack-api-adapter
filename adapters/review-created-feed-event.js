const _ = require('lodash');
const adapterHelper = require('./adapter-helper');

module.exports = function (request, review, config) {
	const reviewers = adapterHelper.getReviewers(request);
	const author = adapterHelper.getActor(request);

	return {
		parse: 'full',
		attachments: [
			{
				title: `[${request.data.base.reviewId}] ${review.title}`,
				title_link: adapterHelper.getReviewUrl(request),
				fallback: `New Review`,
				fields: [
					{
						title: 'Revisions',
						value: adapterHelper.getRevisions(request).join(', ')
					},
					{
						title: 'Reviewer(s)',
						value: reviewers.join(', '),
						short: true
					}
				],
				color: '#F35A00'
			}
		]
	}
};
