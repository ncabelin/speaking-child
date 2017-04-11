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

		var guide = {
			food: ['apple', 'banana', 'bread', 'butter', 'cake', 'candy', 'cereal', 'cheese', 'coffee', 'cookie', 'crackers', 'drink',
						'egg', 'food', 'grapes', 'gum', 'hamburger', 'hotdog', 'icecream', 'juice', 'meat', 'milk', 'orange', 'pizza', 'pretzel',
						'soda soup', 'spaghetti', 'tea', 'toast', 'water'],
			toys: ['ball', 'balloon', 'blocks', 'book', 'bubble', 'crayons', 'doll', 'present', 'slide', 'swing', 'teddybear'],
			outdoors: ['flower', 'house', 'moon', 'rain', 'sidewalk', 'snow', 'star'],
			animals: ['bear', 'bee', 'bird', 'bug', 'bunny', 'cat', 'chicken', 'cow', 'dog', 'duck', 'elephant', 'fish', 'frog', 'horse',
							'monkey', 'pig', 'puppy', 'snake', 'tiger', 'turkey', 'turtle', 'shark'],
			body: ['arm', 'belly', 'bellybutton', 'chin', 'ear', 'elbow', 'eye', 'face', 'finger', 'foot', 'hair', 'hand', 'knee', 'leg',
						'mouth', 'neck', 'nose', 'teeth', 'thumb', 'toe', 'tummy'],
			places: ['church', 'home', 'hospital', 'library', 'mcdonalds', 'park'],
			actions: ['bath', 'breakfast', 'bring', 'catch', 'clap', 'clean', 'close', 'come', 'cough', 'cut', 'dance', 'dinner', 'doodoo',
							'down', 'eat', 'feed', 'finish', 'fix', 'get', 'give', 'go', 'have', 'help', 'hit', 'hug', 'jump', 'kick', 'kiss',
							'knock', 'look', 'love', 'lunch', 'take', 'nap', 'outside', 'pattycake', 'peekaboo', 'peepee', 'push', 'read', 'ride',
							'run', 'see', 'show', 'sing', 'sit', 'sleep', 'stop', 'take', 'throw', 'tickle', 'walk', 'want'],
			household: ['bathtub', 'bed', 'blanket', 'bottle', 'bowl', 'chair', 'clock', 'crib', 'cup', 'door', 'floor', 'fork', 'glass',
							'knife', 'light', 'mirror', 'pillow', 'plate', 'potty', 'radio', 'room', 'sink', 'soap', 'sofa', 'spoon', 'stairs',
							'table', 'telephone', 'towel', 'trash', 'tv', 'window'],
			personal: ['brush', 'comb', 'glasses', 'key', 'money', 'paper', 'pen', 'pencil', 'penny', 'pocketbook', 'tissue', 'toothbrush',
							'umbrella', 'watch'],
			people: ['aunt', 'baby', 'boy', 'daddy', 'doctor', 'girl', 'grandma', 'grandpa', 'lady', 'man', 'mommy', 'own name', 'pet name', 'uncle'],
			clothes: ['belt', 'boots', 'coat', 'diaper', 'dress', 'gloves', 'hat', 'jacket', 'mittens', 'pajamas', 'pants', 'shirt', 'shoes', 'slippers', 'sneakers', 'socks', 'sweater'],
			vehicles: ['bike', 'boat', 'bus', 'car', 'motorbike', 'plane', 'stroller', 'train',
				'trolley', 'truck'],
			modifiers: ['allgone', 'bad', 'big', 'black', 'clean', 'cold', 'down', 'good', 'happy',
				'heavy', 'little', 'mine', 'more', 'open', 'pretty', 'stinky', 'this', 'that', 'there', 'tired', 'white', 'yellow'],
			others: ['a,b,c', 'away', 'booboo', 'curse', 'words', 'hi', 'hello', 'off', 'on', 'out', 'in', 'please', 'shut up', 'thank you']
		}


		return {
			readWords: readWords,
			addWord: addWord,
			editWord: editWord,
			deleteWord: deleteWord,
			readPhrases: readPhrases,
			addPhrase: addPhrase,
			editPhrase: editPhrase,
			deletePhrase: deletePhrase,
			guide: guide
		}
	}
})();