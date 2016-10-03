const _ = require('lodash');
const axios = require(`axios`);
const config = require('../config');

module.exports = (function() {
	return {
		getActor: function(request) {
			/* 
			"actor": {
                 "userId": "...",
                 "userName": "...",
                "userEmail": "..."
            } 
			*/
			return _.get(request, 'data.base.actor', {}) 
		},
		getReviewers: function(request) {
			var reviewers = _.get(request, 'data.base.userIds', []).map(function(user) { return user.userName });
			var actor = this.getActor(request);
			var actorName = actor.userName;
			if (actorName && reviewers.indexOf(actorName) == -1)
				reviewers.push(actor.userName);
			return reviewers;
		},
		getRevisions: function(request) {
			var revisions = request.data.revisions;
			if (revisions === undefined || revisions.length == 0)
				return [];
			return revisions;
		},
		getReviewUrl: function(request) {
			return `${config.upsourceUrl}/${request.projectId}/review/${request.data.base.reviewId}`;
		},		
		sanitizeForSlack: function(text) {
			// at-mentioning results in @{userId,userName}, so translate this as @userName
			return text.replace(/@\{[^,]+,([^\}]+)}/g, '@$1');
		},
		fetchAvatarLink: function(userInfo) {			
			var avatarRequest = axios.request({
				url: userInfo.avatarUrl,
				method: 'head',
				transformResponse: [function(data) { return null }],
			});

			return {
				then: function(callback) {
					return avatarRequest.then(function(response) {
						var link = response.headers.link;
						if (link && link.charAt(0) == '<')
							link = link.substr(1, link.indexOf('>') - 1);

						console.log(`Found avatar link: ${link}`);
						return callback(link);
					});
				}
			}			
		}
	}
})();