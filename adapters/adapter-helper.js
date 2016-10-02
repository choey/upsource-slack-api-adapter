const _ = require('lodash');

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
		}
	}
}();
