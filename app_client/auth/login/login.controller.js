(function() {
	angular
		.module('speakingChild')
		.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['$location', 'auth'];
	function loginCtrl($location, auth) {
		var vm = this;
		vm.alertMsg = false;
		vm.credentials = {
			username: '',
			password: ''
		};

		vm.onSubmit = function() {
			auth
				.login(vm.credentials)
				.then(function(result) {
					vm.alertMsg = false;
					auth.saveToken(result.data.token);
					$location.path('word');
				}, function(err) {
					vm.alertMsg = 'Invalid username and/or password';
				});
		}

	}
})();
