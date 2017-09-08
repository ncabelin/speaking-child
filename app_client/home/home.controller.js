(function() {
	angular
		.module('speakingChild')
		.controller('homeCtrl', homeCtrl);

		homeCtrl.$inject = ['$http', 'auth'];
		function homeCtrl($http, auth) {
			var vm = this;
			vm.logged_in = auth.isLoggedIn();
		}
})();