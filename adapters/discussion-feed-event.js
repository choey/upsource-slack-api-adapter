const _ = require('lodash');
const adapterHelper = require('./adapter-helper');

module.exports = function(request, review, config) {
	const reviewers = adapterHelper.getReviewers(request);
	const author = _.get(request, 'data.base.actor.userName', ''); 

	return {
		attachments: [
			{
				title: `[${request.data.base.reviewId}] ${review.title}`,
				title_link: `http://${config.upsourceUrl}/${review.projectId}/review/${request.data.base.reviewId}`,
				author_name: author,
				fallback: `[New comment by ${author} on [${request.data.base.reviewId}]`,
				fields: [
					{
						title: 'Comment',
						value: request.data.commentText
					},				
					{
						title: 'Reviewer(s)',
						value: reviewers,
						short: true
					}
				],
				color: '#3AA3E3'
			}
		]
	}
};
