const _ = require('lodash');
const config = require('../config');
const adapterHelper = require('./adapter-helper');

module.exports = function() {
	return {
		getActor: function(request) { 
			return _.get(request, 'data.base.actor.userName', '') 
		},
		getReviewers: function(request) {
			var reviewers = _.get(request, 'data.base.userIds', []).map(function(user) { return user.userName });
			var actor = this.getActor(request);
			if (actor && reviewers.indexOf(actor) == -1)
				reviewers.push(actor);
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
		}
	}
}();
