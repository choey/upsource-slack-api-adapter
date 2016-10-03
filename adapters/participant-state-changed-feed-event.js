const _ = require('lodash');
const adapterHelper = require('./adapter-helper');

module.exports = function(request, review, userInfo, config) {
	const author = adapterHelper.getActor(request);
        const reviewers = adapterHelper.getReviewers(request);
	const reviewState  = {
		0: 'N/A',		// probably an impossible value
		1: 'In Review',
		2: 'Accepted',
		3: 'Issue Raised'
	};

	const color = (function() {
		var goodStates = [1, 2];
		var isBadState = goodStates.indexOf(request.data.newState) == -1;
		return isBadState ? '#F35A00' : '#2AB27B'; 
	});

	const message = (function(oldState, newState) {
		if (newState == 'Accepted')
		{
			return 'Ship It!';
		}

		return newState;
	});

	var oldState = reviewState[request.data.oldState];
	var newState = reviewState[request.data.newState];

	return {
		mrkdown: true,
		attachments: [
			{
                                title: `[${request.data.base.reviewId}] ${review.title}`,
                                title_link: adapterHelper.getReviewUrl(request),
                                author_name: message(oldState, newState),
				fallback: `[${request.data.base.reviewId}] Participant state changed from ${reviewState[request.data.oldState]} to ${reviewState[request.data.newState]}`,
				// TODO: post a random ship pic instead of old/new states
				fields: [
					{
						title: 'Old State',
						value: `_${oldState}_`,
						short: true
					},
					{
						title: 'New State',
						value: `_${newState}_`,
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
