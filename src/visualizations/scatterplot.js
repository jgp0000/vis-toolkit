      case "scatterplot":

        vars.params = {
          x_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
                      .domain([0, d3.max(vars.data, function(d) { return d[vars.var_x]; })]).nice(),
            }
          ],

          x_ticks: 10,

          y_scale: d3.scale.linear()
                      .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
                      .domain([0, d3.max(vars.data, function(d) { return d[vars.var_y]; })]).nice(),

          path: d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale(d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale(d[vars.var_y]); }),

          connect: {
            type: null
          },

          items: [{
            attr: "country",
            marks: [{
                type: "circle",
                rotate: "0",
              }, {
                type: "text",
                rotate: "30",
                translate: null
              }]
            }, {
            attr: "continent",
            marks: [{
              type: "arc"
            }, {
                type: "text",
                rotate: "-30",
                translate: null
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.evt.register("highlightOn", function(d) {

          gItems.selectAll(".items_mark").classed("highlighted", function(e, j) { return e === d; });

        });

        vars.evt.register("highlightOut", function(d) {

          gItems.selectAll(".items_mark").classed("highlighted", false);
          gItems.selectAll(".dot__label").classed("highlighted", false);

        });

        // AXIS
        vars.svg.call(vistk.utils.axis)
                .select(".x.axis")
                .attr("transform", "translate(0," + (vars.height - vars.margin.bottom - vars.margin.top) + ")")
              .append("text") // TODO: fix axis labels
                .attr("class", "label")
                .attr("x", vars.width-vars.margin.left-vars.margin.right)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(function(d) { return vars.var_x; });                

        vars.svg.call(vistk.utils.y_axis);
 
        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                          .data(vars.new_data, function(d, i) { 
                            return d.name; 
                          });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                          .each(vistk.utils.items_group)
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                          });

        if(vars.aggregate === vars.var_group) {

          vars.pie = d3.layout.pie().value(function(d) { return d[vars.var_share]; }); // equal share

          vars.radius = vars.width/12;
          vars.accessor_data = function(d) { return d.data; };

          gItems_enter.each(function(d) {

            // Special arc for labels centroids
            var arc = d3.svg.arc().outerRadius(vars.radius).innerRadius(vars.radius);

            // Bind data to groups
            var gItems2 = vars.svg.selectAll(".mark__group2")
                             .data(vars.pie(vars.new_data), function(d, i) { return i; });

            // ENTER

            // Add a group for marks
            var gItems2_enter = gItems2.enter()
                            .append("g")
                              .attr("transform", "translate(" + vars.width/2 + "," + vars.height/2 + ")")
                              .each(vistk.utils.items_group)
                              .attr("transform", function(d) {
                                return "translate(" + vars.params.x_scale[0]["func"](vars.accessor_data(d)[vars.var_x]) + ", " + vars.y_scale(vars.accessor_data(d)[vars.var_y]) + ")";
                              });

            vars.items[1].marks.forEach(function(d) {

              vars.mark.type = d.type;
              vars.mark.rotate = d.rotate;
              gItems2_enter.each(vistk.utils.items_mark);

            });

          });

        } else {

            // Add graphical marks
            vars.items[0].marks.forEach(function(d) {

              vars.mark.type = d.type;
              vars.mark.rotate = d.rotate;
              gItems_enter.each(vistk.utils.items_mark);

            });

        }

        // EXIT
        var gItems_exit = gItems.exit().remove();

        // POST-UPDATE
        gItems
          .transition()
          .attr("transform", function(d) {
            return "translate(" + vars.params.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
          });

      break;
        