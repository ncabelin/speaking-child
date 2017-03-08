(function() {
	angular
		.module('speakingChild')
		.directive('navigation', navigation);

	function navigation() {
		return {
			restrict: 'EA',
			templateUrl: '/common/directives/navigation/nav.template.html',
			controller: 'navCtrl as navvm'
		};
	}
})();