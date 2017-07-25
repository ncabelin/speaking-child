(function() {
	angular
		.module('speakingChild')
		.controller('chartCtrl', chartCtrl);

		chartCtrl.$inject = ['$http', 'wordData'];
		function chartCtrl($http, wordData) {
      var vm = this;

      // fetch data
      wordData.readWords()
        .then(function(result) {
          vm.words = result.data.words;
          console.log(vm.words);
          vm.createChartData();
          vm.drawChart();
        });

        // group words by date for charting
    		vm.createChartData = function() {
    			vm.dates = {};
    			vm.dateList = [];
    			// iterate over all words
    			for (var i = 0; i < vm.words.length; i++) {
            var date = new Date(vm.words[i].date_added);
    				var month = date.getUTCMonth(),
    						day = date.getUTCDate(),
    						year = date.getUTCFullYear(),
    						c_date = month + '/' + day + '/' + year;

    				// check if dates exists
    				// then increment or create counter
    				if (!vm.dates[c_date]) {
    					vm.dates[c_date] = 1;
    				} else {
    					vm.dates[c_date] += 1;
    				}
    			}

    			// push to array
    			for (var key in vm.dates) {
    				if (vm.dates.hasOwnProperty(key)) {
    					vm.dateList.push({
    						'date': key,
    						'number': vm.dates[key]
    					});
    				}
    			}

          // date sorting algorithm
          vm.dateList.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
          });

          // increment numbers of words for each date
          // to show how much the increase in words are
    			for (var i = 1, j = vm.dateList.length; i < j ;i++) {
            vm.dateList[i].number += vm.dateList[i-1].number;
          }

          console.log(vm.dateList);
    		};

        vm.drawChart = function() {

        };
		}
})();
