      case "dotplot":

        vars = vistk.utils.merge(vars, vars.params["dotplot"]);

        // Remove any existing grid or axes (TO BE FIXED)
        vars.svg.selectAll(".x, .y").remove();

        // TODO: should specify this is an horizontal axis
        vars.svg.call(vistk.utils.axis);

        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                        });

        // Add graphical marks
        vars.items[0].marks.forEach(function(d) {
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark);
          gItems.each(vistk.utils.items_mark)
                .select("text")
                .classed("highlighted", function(d, i) { return d.__highlighted; });
        });

        // EXIT
        var gItems_exit = gItems.exit().style("opacity", 0.1);

        // POST-UPDATE
        vars.svg.selectAll(".mark__group")
                        .classed("highlighted", function(d, i) { return d.__highlighted; })
                        .transition()
                        .delay(function(d, i) { return i / vars.data.length * 100; })
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          if(vars.x_type === "index") {
                            return "translate(" + d[vars.var_x] + ", " + vars.height/2 + ")";
                          } else {
                            return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.height/2 + ")";
                          }
                        });

        break;
