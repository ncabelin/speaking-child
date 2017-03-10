(function() {
	angular
		.module('speakingChild')
		.service('auth', authentication);

	authentication.$inject = ['$http', '$window', '$location'];

	function authentication($http, $window, $location) {
		var saveToken = function(token) {
			$window.localStorage['mean-token'] = token;
		};

		var getToken = function() {
			return $window.localStorage['mean-token'];
		};

		var isLoggedIn = function() {
			var token = getToken();
			var payload;

			if (token) {
				payload = token.split('.')[1];
				payload = $window.atob(payload);
				payload = JSON.parse(payload);

				return payload.exp > Date.now() / 1000;
			} else {
				return false;
			}
		};

		var currentUser = function() {
			if (isLoggedIn()) {
				var token = getToken();
				var payload = token.split('.')[1];
				payload = $window.atob(payload);
				payload = JSON.parse(payload);
				return {
					user_id: payload._id,
					child_name: payload.child_name
				};
			}
		};

		var register = function(user) {
			return $http.post('/api/register', user);
		};

		var login = function(user) {
			return $http.post('/api/login', user);
		};

		var logout = function() {
			console.log('logging out');
			$window.localStorage.removeItem('mean-token');
			$location.path('login');
		};

		return {
			saveToken: saveToken,
			getToken: getToken,
			login: login,
			logout: logout,
			register: register,
			isLoggedIn: isLoggedIn,
			currentUser: currentUser
		};
	}
})();
