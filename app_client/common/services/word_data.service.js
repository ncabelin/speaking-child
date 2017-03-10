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

		var readWords = function(id) {
			console.log(authObj);
			return $http.get('/api/words/' + id, authObj);
		};

		var addWord = function(obj) {
			return $http.post('/api/word', obj, authObj);
		};

		var editWord = function(obj) {
			return $http.put('/api/word', obj, authObj);
		};

		var deleteWord = function(id) {
			return $http.delete('/api/word/' + id, authObj);
		};


		return {
			readWords: readWords,
			addWord: addWord,
			editWord: editWord,
			deleteWord: deleteWord
		}
	}
})();