(function() {
	angular
		.module('speakingChild')
		.controller('navCtrl', navCtrl);

	navCtrl.$inject = ['$location', 'auth'];
	function navCtrl($location, auth) {
		var vm = this;
		vm.isLoggedIn = auth.isLoggedIn();
		vm.currentUser = auth.currentUser();
		vm.logout = function() {
			auth.logout();
		};
	}
})();