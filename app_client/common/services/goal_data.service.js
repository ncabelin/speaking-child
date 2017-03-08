(function() {
	angular
		.module('speakingChild')
		.service('goalData', goalData);

	goalData.$inject = ['$http', 'auth'];
	function goalData($http, auth) {
		var authObj = {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		};

		var readGoals = function() {
			return $http.get('/api/goals', authObj);
		};

		var addGoals = function(obj) {
			return $http.post('/api/goal', obj, authObj);
		};

		var editGoal = function(obj) {
			return $http.put('/api/goal', obj, authObj);
		};

		var deleteGoal = function(obj) {
			return $http.delete('/api/goal', obj, authObj);
		};


		return {
			readGoals: readGoals,
			addGoal: addGoal,
			editGoal: editGoal,
			deleteGoal: deleteGoal
		}
	}
})();