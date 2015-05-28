      case "stacked":

        // Events handlers
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

       // var parseDate = d3.time.format("%y-%b-%d").parse,
        var formatPercent = d3.format(".0%");

        vars.x_scale = d3.time.scale()
            .range([0, vars.width]);

        var y = d3.scale.linear()
            .range([vars.height, 0]);

        var xAxis = d3.svg.axis()
            .scale(vars.x_scale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);

        var area = d3.svg.area()
            .interpolate('cardinal')
            .x(function(d) { return vars.x_scale(d.date); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        var stack = d3.layout.stack()
            .values(function(d) { return d.values; });

        vars.x_scale.domain(d3.extent(data, function(d) { return d.date; }));

        var browser = vars.svg.selectAll(".browser")
            .data(vars.new_data)
          .enter().append("g")
            .attr("class", "browser");

        browser.append("path")
            .attr("class", "area")
            .attr("d", function(d) { return area(d.values); })
            .style("fill", function(d) { return vars.color(d.name); });

        browser.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + vars.x_scale(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
            .attr("x", -6)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(xAxis);

        vars.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

/*

        // PRE-UPDATE
        var gPoints = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER

        // Add a group for marks
        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .each(vistk.utils.items_group);

        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark);

        // Add an other graphical mark (e.g. text labels)

        // Add a connection mark
        gPoints_enter.each(vistk.utils.connect_mark)

        // Add axis
        gPoints_enter.each(vistk.utils.axis)

        // Add grid layer

        // EXIT
        var gPoints_exit = gPoints.exit();

        // POST-UPDATE
        gPoints
            .transition();
*/
      break;
      