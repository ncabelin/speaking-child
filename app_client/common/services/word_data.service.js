(function() {
	angular
		.module('speakingChild')
		.service('wordData', wordData);

	wordData.$inject = ['$http', 'auth'];
	function wordData($http, auth) {
		var getAuthObj = function() {
			return {
				headers: {
					Authorization: 'Bearer ' + auth.getToken()
				}
			};
		}

		var readWords = function() {
			return $http.get('/api/words/', getAuthObj());
		};

		var addWord = function(obj) {
			return $http.post('/api/word', obj, getAuthObj());
		};

		var editWord = function(obj) {
			return $http.put('/api/word', obj, getAuthObj());
		};

		var deleteWord = function(id) {
			return $http.delete('/api/word/' + id, getAuthObj());
		};

		var readPhrases = function() {
			return $http.get('/api/phrases', getAuthObj());
		};

		var addPhrase = function(obj) {
			return $http.post('/api/phrase', obj, getAuthObj());
		};

		var editPhrase = function(obj) {
			return $http.put('/api/phrase', obj, getAuthObj());
		};

		var deletePhrase = function(id) {
			return $http.delete('/api/phrase/' + id, getAuthObj());
		};


		return {
			readWords: readWords,
			addWord: addWord,
			editWord: editWord,
			deleteWord: deleteWord,
			readPhrases: readPhrases,
			addPhrase: addPhrase,
			editPhrase: editPhrase,
			deletePhrase: deletePhrase
		}
	}
})();