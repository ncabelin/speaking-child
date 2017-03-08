(function() {
	angular
		.module('speakingChild')
		.service('wordData', wordData);

	wordData.$inject = ['$http', 'auth'];
	function wordData($http, auth) {
		var authObj = {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		};

		var readWords = function() {
			return $http.get('/api/words', authObj);
		};

		var addWord = function(obj) {
			return $http.post('/api/word', obj, authObj);
		};

		var editWord = function(obj) {
			return $http.put('/api/word', obj, authObj);
		};

		var deleteWord = function(obj) {
			return $http.delete('/api/word', obj, authObj);
		};


		return {
			readWords: readWords,
			addWord: addWord,
			editWord: editWord,
			deleteWord: deleteWord
		}
	}
})();