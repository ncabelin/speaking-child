(function() {
	angular
		.module('speakingChild')
		.controller('registerCtrl', registerCtrl);

	registerCtrl.$inject = ['$location', 'auth'];
	function registerCtrl($location, auth) {
		var vm = this;
		vm.alertMsg = false;
		vm.credentials = {
			username: '',
			email: '',
			child_name: '',
			dob: '',
			password: '',
			re_password: ''
		};

		vm.onSubmit = function() {
			if (vm.credentials.password !== vm.credentials.re_password) {
				return vm.alertMsg = 'Password must match Re-enter password field';
			}

			if (vm.credentials.username && vm.credentials.email && vm.credentials.password) {
				vm.alertMsg = false;
				console.log(vm.credentials);
				auth
					.register(vm.credentials)
					.then(function(result) {
						auth.saveToken(result.data.token);
						console.log('Registered');
						$location.path('word');
					}, function(err) {
						vm.alertMsg = 'Unable to register, please choose a different username or enter a correct date of birth in MM/DD/YYYY format';
						console.log(err);
					});
			} else {
				vm.alertMsg = 'Please fill up all fields';
			}
		};
	}
})();
