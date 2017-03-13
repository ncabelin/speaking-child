(function() {
	angular
		.module('speakingChild')
		.controller('wordCtrl', wordCtrl);

	wordCtrl.$inject = ['$location', '$http', 'wordData', 'auth'];
	function wordCtrl($location, $http, wordData, auth) {
		var vm = this;
		var resetAddForm = function() {
			return {
				user_id: auth.currentUser().user_id,
				word: '',
				sound: '',
				category: '',
				date_added: new Date
			};
		};
		vm.new = resetAddForm();
		vm.showAddForm = false;
		vm.words = [];
		vm.phrases = [];
		vm.wordLookUp = {};
		vm.phraseLookUp = {};
		var countWords = function(word) {
			var word_arr = word.split(' '),
					length = word_arr.length;
			if (length > 1) {
				return length;
			}
		};

		var convertDate = function(arr) {
			for (var i = 0, x = arr.length; i < x; i++) {
				arr[i].date_added = new Date(arr[i].date_added);
			}
			return arr;
		}

		var createLookUp = function(arr) {
			var lookup = {};
			for (var i = 0, len = arr.length; i < len; i++) {
				lookup[arr[i]._id] = i;
			}
			return lookup;
		}

		wordData.readWords()
			.then(function(result) {
				vm.words = result.data.words;
				vm.words = convertDate(vm.words);
				// create easy lookup of array index based on _id
				vm.wordLookUp = createLookUp(vm.words);
			}, function(err) {
				vm.alertMsg += 'Error :' + err;
				console.log(err);
			});

		wordData.readPhrases()
			.then(function(result) {
				vm.phrases = result.data.phrases;
				if (vm.phrases[0] !== null) {
					vm.phrases = convertDate(vm.phrases);
				} else {
					vm.phrases = [];
				}
				// create lookup of array index for phrases
				vm.phraseLookUp = createLookUp(vm.phrases);
			}, function(err) {
				vm.alertMsg += 'Error :' + err;
				console.log(err);
			});

		vm.addWord = function(word) {
			if (!vm.new.word) {
				return vm.alertMsg = 'Word field required';
			}

			// auto-capitalize word and sound
			vm.new.word = vm.new.word[0].toUpperCase() + vm.new.word.slice(1);
			if (!vm.new.sound) {
				// auto-fill sound if it is blank
				vm.new.sound = vm.new.word;
			} else {
				vm.new.sound = vm.new.sound[0].toUpperCase() + vm.new.sound.slice(1);
			}

			// check if date is formatted correctly
			console.log(vm.new.date_added);

			var wordArr = word.split(' ');
			if (wordArr.length > 1) {
				// Save PHRASE
				// Check if phrase exists already first
				vm.new.phrase = vm.new.word;
				if (vm.phrases.length > 0 || vm.phrases[0] === null) {
					for (var i = 0, x = vm.phrases.length; i < x; i++) {
						// compare without regard to case
						if (vm.phrases[i].phrase.toLowerCase() == word.toLowerCase()) {
							return vm.alertMsg = phrase + ' was already recorded';
						}
					}
				}
				wordData.addPhrase(vm.new)
					.then(function(result) {
						// reformat date for ng-model rendering
						result.data.date_added = new Date(result.data.date_added);
						vm.phrases.push(result.data);
						vm.phraseLookUp[result.data._id] = vm.phrases.length;
						// reset add word form
						vm.new = resetAddForm();
					}, function(err) {
						vm.alertMsg = 'Error adding Phrase';
						console.log(err);
					});

			} else {

				// Save WORD
				// but check if word exists first
				for (var i = 0, x = vm.words.length; i < x; i++) {
					// compare without regard to case
					if (vm.words[i].word.toLowerCase() == word.toLowerCase()) {
						return vm.alertMsg = word + ' was already recorded';
					}
				}
				wordData.addWord(vm.new)
				.then(function(result) {
					// reformat date for ng-model rendering
					result.data.date_added = new Date(result.data.date_added);
					vm.words.push(result.data);
					vm.wordLookUp[result.data._id] = vm.words.length;
					// reset add word form
					vm.new = resetAddForm();
				}, function(err) {
					vm.alertMsg = 'Error adding Word';
					console.log(err);
				});
			}
		}

		vm.editForm = function(obj) {
			vm.edit = {
				_id: obj._id,
				word: obj.word,
				sound: obj.sound,
				category: obj.category,
				date_added: new Date(obj.date_added)
			}
		}

		vm.editWord = function(obj) {
			console.log(obj);
			wordData.editWord(obj)
				.then(function(result) {
					var index = vm.wordLookUp[result.data._id];
					console.log(index);
					vm.words[index] = result.data;
				}, function(err) {
					vm.alertMsg = 'Error editing';
				});
		};

		vm.editPhrase = function(obj) {
			wordData.editPhrase(obj)
				.then(function(result) {
					console.log('Edit successful');
				}, function(err) {
					vm.alertMsg = 'Error editing';
				});
		};

		vm.deleteWord = function(obj) {
			wordData.deleteWord(obj._id)
				.then(function(result) {
					var index = vm.wordLookUp[obj._id];
					vm.words.splice(index, 1);
				}, function(err) {
					vm.alertMsg = 'Error deleting';
				});
		}

		vm.deletePhrase = function(obj) {
			wordData.deletePhrase(obj._id)
				.then(function(result) {
					var index = vm.phrases.indexOf(obj);
					vm.phrases.splice(index, 1);
				}, function(err) {
					vm.alertMsg = 'Error deleting';
				});
		}
	}
})();