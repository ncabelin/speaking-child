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
		vm.resetForm = function() {
			vm.new = resetAddForm();
			vm.addWordMsg = false;
			vm.addPhraseMsg = false;
		};
		vm.showAddForm = false;
		vm.words = [];
		vm.phrases = [];
		vm.showWord = true;
		vm.loadingMsg = true;
		vm.alert = function(message, status) {
			if (status === 'alert') {
				vm.alertMsg = message;
				vm.successMsg = '';
				return
			} else if (status === 'none') {
				vm.alertMsg = vm.successMsg = message;
			}
			vm.alertMsg = '';
			vm.successMsg = message;
		}
		vm.showPane = function(pane) {
			if (pane == 'word') {
				vm.showPhrase = false;
				vm.showStat = false;
				vm.showWord = true;
			} else if (pane == 'phrase') {
				vm.showPhrase = true;
				vm.showStat = false;
				vm.showWord = false;
			} else {
				vm.showPhrase = false;
				vm.showStat = true;
				vm.showWord = false;
			}
		}

		vm.guide = [];
		vm.guideMatches = [];

		vm.checkMatch = function() {
			// check for match in GUIDE tab
			vm.guide = [];
			vm.guideMatches = [];
			vm.guideObj = {};

			// create initial data structure from GUIDE tab
			for (var key in wordData.guide) {
				if (wordData.guide.hasOwnProperty(key)) {
					for (var i = 0, j = wordData.guide[key].length; i < j; i++) {
						// iterate through every word
						vm.guide.push({ word: wordData.guide[key][i], category: key, status: false});
						if (vm.guideObj[key]) {
							vm.guideObj[key].push({ word: wordData.guide[key][i], status: false });
						} else {
							vm.guideObj[key] = [];
						}
					}
				}
			}

			// check for matches on all recorded words for the GUIDE tab
			vm.words.forEach(function(data) {
				vm.guide.forEach(function(x) {
					if (x.word.toLowerCase() === data.word.toLowerCase()) {
						x.status = true;
						vm.guideMatches.push(data.word.toLowerCase());
					}
				});
			});

			// alter initial data structure's status
			for (var key in vm.guideObj) {
				if (vm.guideObj.hasOwnProperty(key)) {
					for (var i = 0, j = vm.guideObj[key].length; i < j; i++) {
						if (vm.guideMatches.indexOf(vm.guideObj[key][i].word) !== -1) {
							vm.guideObj[key][i].status = true;
						}
					}
				}
			}
		};

		var alter = function(arr, status) {
			// alter array converts date and checks if the sounds are alike
			// to be able to display the right color for the word cell
			for (var i = 0, x = arr.length; i < x; i++) {
				// convert date
				arr[i].date_added = new Date(arr[i].date_added);
				// check if the sound is alike
				if (arr[i][status] !== arr[i].sound) {
					arr[i].status = true;
				} else {
					arr[i].status = false;
				}
			}
			return arr;
		}

		wordData.readWords()
			.then(function(result) {
				vm.words = result.data.words;
				vm.words = alter(vm.words, 'word');
				vm.loadingMsg = false;
				// save word look up in an array
			}, function(err) {
				vm.alert('Error :' + err, 'alert');
				console.log(err);
			});

		wordData.readPhrases()
			.then(function(result) {
				vm.phrases = result.data.phrases;
				if (vm.phrases[0] !== null) {
					vm.phrases = alter(vm.phrases, 'phrase');
				} else {
					vm.phrases = [];
				}
			}, function(err) {
				vm.alert('Error :' + err, 'alert');
				console.log(err);
			});

		vm.addWord = function(word) {
			// check if blank input
			if (!vm.new.word) {
				return vm.alert('Word field required', 'alert');
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
							vm.phraseAddMsg = false;
							return vm.alert('"' + word + '" was already recorded', 'alert');
						}
					}
				}
				wordData.addPhrase(vm.new)
					.then(function(result) {
						// reformat date for ng-model rendering
						result.data.date_added = new Date(result.data.date_added);
						vm.phrases.push(result.data);
						// reset add word form
						vm.new = resetAddForm();
						vm.alert('"' + result.data.phrase + '" successfully added','success');
						vm.showPane('phrase');
					}, function(err) {
						vm.alert('Error adding Phrase','alert');
						console.log(err);
					});

			} else {

				// Save WORD
				// but check if word exists first
				for (var i = 0, x = vm.words.length; i < x; i++) {
					// compare without regard to case
					if (vm.words[i].word.toLowerCase() == word.toLowerCase()) {
						vm.wordAddMsg = false;
						return vm.alert('"' + word + '" was already recorded', 'alert');
					}
				}
				wordData.addWord(vm.new)
				.then(function(result) {
					// reformat date for ng-model rendering
					result.data.date_added = new Date(result.data.date_added);
					result.data.status = (result.data.word !== result.data.sound) ? true : false;
					vm.words.push(result.data);
					// reset add word form
					vm.new = resetAddForm();
					vm.alert('"' + result.data.word + '" successfully added','success');
					vm.showPane('word');
				}, function(err) {
					vm.alert('Error adding Word', 'alert');
					console.log(err);
				});
			}
		}

		vm.editWord = function(obj) {
			wordData.editWord(obj)
				.then(function(result) {
					var index = vm.words.indexOf(obj);
					vm.words[index].status = (vm.words[index].word !== vm.words[index].sound) ? true : false;
					console.log('Word edited successfully');
				}, function(err) {
					vm.alert('Error editing word','alert');
				});
		};

		vm.guideAddWord = function(word) {
			vm.new.word = word;
			vm.new.sound = word;
		};

		vm.editPhrase = function(obj) {
			wordData.editPhrase(obj)
				.then(function(result) {
					console.log('Phrase edited successfully');
				}, function(err) {
					vm.alert('Error editing phrase','alert');
				});
		};

		vm.deleteWord = function(obj) {
			wordData.deleteWord(obj._id)
				.then(function(result) {
					var index = vm.words.indexOf(obj);
					vm.words.splice(index, 1);
					vm.alert('','none');
				}, function(err) {
					vm.alert('Error deleting word','alert');
				});
		}

		vm.deletePhrase = function(obj) {
			wordData.deletePhrase(obj._id)
				.then(function(result) {
					var index = vm.phrases.indexOf(obj);
					vm.phrases.splice(index, 1);
					vm.alert('','none');
				}, function(err) {
					vm.alert('Error deleting phrase','alert');
				});
		}

	}
})();
