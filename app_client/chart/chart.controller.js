(function() {
	angular
		.module('speakingChild')
		.controller('chartCtrl', chartCtrl);

		chartCtrl.$inject = ['$http', 'wordData', 'auth'];
		function chartCtrl($http, wordData, auth) {
      var vm = this;
      vm.loading = true;

      // fetch data
      wordData.readWords()
        .then(function(result) {
          vm.words = result.data.words;
          // get child's birthday
          vm.dob = auth.currentUser().dob;
          vm.createChartData();
          vm.drawChart();
          vm.loading = false;
        });

        // group words by date for charting
    		vm.createChartData = function() {
    			vm.dates = {};
    			vm.dateList = [];
    			// iterate over all words
    			for (var i = 0; i < vm.words.length; i++) {
            var date = new Date(vm.words[i].date_added);
    				var month = date.getMonth(),
    						day = date.getDate(),
    						year = date.getFullYear(),
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
          var dob = new Date(vm.dob);
    			for (var key in vm.dates) {
    				if (vm.dates.hasOwnProperty(key)) {
              var age = new Date(new Date(key) - dob).getTime();
    					vm.dateList.push({
                'date': key,
                // age in months
    						'age': Math.round((age * 3.8027) / 10000000000),
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
    		};

        // Draws d3 chart
        vm.drawChart = function() {
          var margin = {top: 20, right: 0, bottom: 100, left: 80},
              width = 800 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

          // Parse the date / time
          var	parseDate = d3.time.format("%Y-%m-%d").parse;

          var x = d3.scale.ordinal().rangeRoundBands([0, width], .15);

          var y = d3.scale.linear().range([height, 0]);

          console.log(d3.time.year);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .ticks(d3.time.months, 3)
              .tickFormat(d3.time.format("%Y-%m"));

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10);

          var svg = d3.select("#chart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

          function renderBar(data) {

              data.forEach(function(d) {
                  d.date = new Date(d.date);
              });

            x.domain(data.map(function(d) { return d.date; }));
            y.domain([d3.min(data, function(d) { return d.number; }), d3.max(data, function(d) { return d.number; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
              .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)" );

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Number of words");

            svg.selectAll("bar")
                .data(data)
              .enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", function(d) { return x(d.date); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.number); })
                .attr("height", function(d) { return height - y(d.number); });

          }

          renderBar(vm.dateList);
        };
		}
})();
