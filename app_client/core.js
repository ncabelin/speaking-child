(function() {
	angular.module('speakingChild', ['ngRoute'])
		.config(function($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'home/home.view.html'
				})

				.when('/register', {
					templateUrl: 'auth/register/register.view.html',
				})

				.when('/login', {
					templateUrl: 'auth/login/login.view.html',
				})

				.when('/word', {
					templateUrl: 'word/word.view.html'
				})

				.when('/help', {
					templateUrl: 'help/help.view.html'
				})

				.when('/chart', {
					templateUrl: 'chart/chart.view.html'
				})

				.otherwise({ redirectTo: '/'});

			$locationProvider.html5Mode(true);
		})

		.run(['$rootScope', '$location', 'auth', function($rootScope, $location, auth) {
			$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
				if ($location.path() === '/word' && !auth.isLoggedIn()) {
					$location.path('/');
				} else if ($location.path() === '/chart' && !auth.isLoggedIn()) {
					$location.path('/');
				}
			});
		}]);
})();
