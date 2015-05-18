      case "linechart":

        vars.evt.register("highlightOn", function(d) {

          vars.svg.selectAll(".line:not(.selected)").style("opacity", 0.2);
          vars.svg.selectAll(".text:not(.selected)").style("opacity", 0.2);

          vars.svg.selectAll("#"+d[vars.var_id]).style("opacity", 1);

          vars.svg.selectAll(".line").filter(function(e, j) { return e === d; }).style("stroke-width", 3);
          vars.svg.selectAll(".text").filter(function(e, j) { return e === d; }).style("text-decoration", "underline");

        })

        vars.evt.register("highlightOut", function(d) {

          vars.svg.selectAll(".country:not(.selected)").style("opacity", 1);

          vars.svg.selectAll(".line").filter(function(e, j) { return e === d; }).style("stroke-width", 1);
          vars.svg.selectAll(".text").filter(function(e, j) { return e === d; }).style("text-decoration", "none");

        })

        vars.evt.register("selection", function(d) {

          vars.svg.selectAll("#"+d[vars.var_id])
                  .classed("selected", !vars.svg.selectAll("#"+d[vars.var_id]).classed("selected"));

        });

        vars.x_scale = d3.time.scale()
            .range([0, vars.width-100]);

        vars.y_scale = d3.scale.linear()
            .range([0, vars.height-100]);

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale)
            .orient("top");

        vars.y_axis = d3.svg.axis()
            .scale(vars.y_scale)
            .orient("left");

        // TODO: use the connection mark instead of the line
        // FIX FOR MISSING VALUES
        // https://github.com/mbostock/d3/wiki/SVG-Shapes
        vars.svg_line = d3.svg.line()
        // https://gist.github.com/mbostock/3035090
            .defined(function(d) { return d[vars.var_y] != null; })
            .interpolate(vars.interpolate)
            .x(function(d) { return vars.x_scale(d[vars.var_time]); })
            .y(function(d) { return vars.y_scale(d[vars.var_y]); });

        // TODO: fix the color scale
        vars.color.domain(d3.keys(vars.new_data[0]).filter(function(key) { return key !== "date"; }));

        vars.x_scale.domain(d3.extent(vars.new_data, function(d) { return d[vars.var_time]; }));

        vars.y_scale.domain([
          d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v[vars.var_y]; }); }),
          d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v[vars.var_y]; }); })
        ]);

        vars.svg.append("g")
            .attr("class", "x grid")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(vistk.utils.make_x_axis()
            .tickSize(-vars.height, 0, 0)
            .tickFormat(""));

        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + -5 + ")")
            .call(vars.x_axis);

        vars.svg.append("g")
            .attr("class", "y axis")
            .call(vars.y_axis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-1.71em")
            .style("text-anchor", "end")
            .text(vars.y_text);

        var country = vars.svg.selectAll(".country")
            .data(countries)
          .enter()
            .append("g")
            .attr("class", function(d) {

              var c = "country";

              if(vars.selection.indexOf(d.name) >= 0)
                c += " selected";

              if(vars.highlight.indexOf(d.name) >= 0)
                c += " highlighted";

              return c;
            });

        country.append("path")
            .attr("class", "country line")
            .attr("d", function(d) {
              return vars.svg_line(d.values); 
            })
            .attr("id", function(d) { return d[vars.var_id]; })
            .attr("class", function(d) {

              var c = "country line";

              if(vars.selection.indexOf(d.name) >= 0)
                c += " selected";

              if(vars.highlight.indexOf(d.name) >= 0)
                c += " highlighted";

              return c;
            })
            .style("stroke", function(d) { return vars.color(d[vars.var_color]); });

        country.append("text")
            .datum(function(d) { 
              d.values.sort(function(a, b) { return a.year > b.year;}); 
              return {name: d.name, id: d[vars.var_id], value: d.values[d.values.length - 1]}; 
            })
            .attr("transform", function(d) { 
              return "translate(" + vars.x_scale(d.value[vars.var_time]) + "," + vars.y_scale(d.value.rank) + ")"; 
            })
            .attr("x", 3)
            .attr("class", function(d) {

              var c = "country text";

              if(vars.selection.indexOf(d.name) >= 0)
                c += " selected";

              if(vars.highlight.indexOf(d.name) >= 0)
                c += " highlighted";

              return c;
            })
            .attr("dy", ".35em")
            .attr("id", function(d) { return d[vars.var_id]; })
            .text(function(d) { return d[vars.var_text]; })

        vars.svg.selectAll(".country").on("mouseover", function(d) {
          vars.evt.call("highlightOn", d);
        })
        .on("mouseout", function(d) {
          vars.evt.call("highlightOut", d);
        });

        vars.svg.selectAll("text.country").on("click", function(d) {
          vars.evt.call("selection", d);
        })
/*
        vars.svg.select("svg").on("click", function(d) {

          d3.selectAll(".selected").classed("selected", false);
          d3.selectAll(".line:not(.selected)").style("opacity", 1);
          d3.selectAll(".text:not(.selected)").style("opacity", 1);

        })
*/
        break;
