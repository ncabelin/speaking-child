(function() {
	angular
		.module('speakingChild')
		.controller('wordCtrl', wordCtrl);

	wordCtrl.$inject = ['$location', '$http', 'wordData', 'auth'];
	function wordCtrl($location, $http, wordData, auth) {
		var vm = this;
		vm.new = {
			user_id: auth.currentUser().user_id,
			word: '',
			sound: '',
			category: '',
			date_added: new Date
		};
		vm.showAddForm = false;
		vm.words = [];

		wordData.readWords({ _id: auth.currentUser().user_id })
			.then(function(result) {
				console.log(result);
				vm.words = result.data;
			}, function(err) {
				vm.alertMsg += 'Error :' + err;
				console.log(err);
			});

		vm.addWord = function() {
			wordData.addWord(vm.new)
				.then(function(result) {
					console.log(result.data);
					vm.words.push(result.data);
				});
		}
	}
})();