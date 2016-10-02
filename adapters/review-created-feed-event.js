const _ = require('lodash');

module.exports = function(request, review, config) {
        const reviewers = request.data.base.userIds.map(function(user) { return user.userName }).join(', ');
	const author = _.get(request, 'data.base.actor.userName', '');

        return {
                attachments: [
                        {
                                title: `[${request.data.base.reviewId}] ${review.title}`,
                                title_link: `http://${config.upsourceUrl}/${review.projectId}/review/${request.data.base.reviewId}`,
                                author_name: author,
                                fallback: `New Review [${request.data.base.reviewId}] raised by ${author}`,
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
				color: '#F35A00'
			}
		]
	}
};
