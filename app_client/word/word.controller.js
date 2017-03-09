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

		wordData.readWords(auth.currentUser().user_id)
			.then(function(result) {
				console.log(result);
				vm.words = result.data.words;
			}, function(err) {
				vm.alertMsg += 'Error :' + err;
				console.log(err);
			});

		vm.addWord = function() {
			console.log(vm.words);
			for (var i = 0; i < vm.words.length; i++) {
				console.log(i);
				if (vm.words[i].word.toLowerCase() == vm.new.word.toLowerCase()) {
					return vm.alertMsg = vm.new.word + ' is already recorded';
				}
			}
			vm.new.word = vm.new.word[0].toUpperCase() + vm.new.word.slice(1);
			wordData.addWord(vm.new)
				.then(function(result) {
					console.log(result.data);
					vm.words.push(result.data);
					vm.new = {
						user_id: auth.currentUser().user_id,
						word: '',
						sound: '',
						category: '',
						date_added: new Date
					};
				});
		}
	}
})();