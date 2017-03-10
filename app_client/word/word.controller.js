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
				vm.words.forEach(function(data) {
					// convert to ng-model friendly format
					data.date_added = new Date(data.date_added);
				})
			}, function(err) {
				vm.alertMsg += 'Error :' + err;
				console.log(err);
			});

		vm.addWord = function() {
			console.log(vm.words);

			// check if word exists already
			for (var i = 0; i < vm.words.length; i++) {
				console.log(i);
				if (vm.words[i].word.toLowerCase() == vm.new.word.toLowerCase()) {
					return vm.alertMsg = vm.new.word + ' is already recorded';
				}
			}

			// auto-capitalize word and sound
			vm.new.word = vm.new.word[0].toUpperCase() + vm.new.word.slice(1);
			vm.new.sound = vm.new.sound[0].toUpperCase() + vm.new.word.slice(1);

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
				}, function(err) {
					vm.alertMsg = 'Error adding';
					console.log(err);
				});
		}

		vm.editWord = function(obj) {
			wordData.editWord(obj)
				.then(function(result) {
					console.log(result.data);
				}, function(err) {
					vm.alertMsg = 'Error editing';
				});
		};

		vm.deleteWord = function(obj) {
			wordData.deleteWord(obj._id)
				.then(function(result) {
					var index = vm.words.indexOf(obj);
					vm.words.splice(index, 1);
				}, function(err) {
					vm.alertMsg = 'Error deleting';
				});
		}
	}
})();