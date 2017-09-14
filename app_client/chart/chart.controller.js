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
  						year = date.getFullYear(),
  						c_date = month + '/' + year;

  				// check if dates exists
  				// then increment or create counter
  				if (!vm.dates[c_date]) {
  					vm.dates[c_date] = 1;
  				} else {
  					vm.dates[c_date] += 1;
  				}
  			}

        console.log(vm.dates);

  			// push to array
        var dob = new Date(vm.dob);
  			for (var key in vm.dates) {
  				if (vm.dates.hasOwnProperty(key)) {
            var date = key.split('/');
            var month = date[0];
            var year = date[1];
            var date_str = month + '/3/' + year;
            console.log(date_str);
            var age = new Date(new Date(date_str) - dob).getTime();
  					vm.dateList.push({
              'date': date_str,
              // age in months
  						'age': Math.round((age * 3.8027) / 10000000000),
  						'number': vm.dates[key]
  					});
  				}
  			}

        console.log(vm.dateList);

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
        var w = window.innerWidth > 960 ? 960: window.innerWidth;
        var svg = d3.select("svg"),
        margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = w - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.2);

        var y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        function renderBar(data) {

          x.domain(data.map(function(d) { return d.age; }));
          y.domain([0, d3.max(data, function(d) { return d.number; })]);

          g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          g.append("g")
              .attr("class", "axis axis--y")
              .call(d3.axisLeft(y))
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
              .text("No. of words");

          g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.age); })
              .attr("y", function(d) { return y(d.number); })
              .attr("width", x.bandwidth())
              .attr("height", function(d) { return height - y(d.number); })
              .on("mouseover", function(d) {
               div.transition()
                 .duration(200)
                 .style("opacity", .9);
               div.html(d.age + " months old<br/> speaking<br /> " + d.number + " words")
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
               })
             .on("mouseout", function(d) {
               div.transition()
                 .duration(500)
                 .style("opacity", 0);
               });
        }

        renderBar(vm.dateList);
      };
		}
})();
