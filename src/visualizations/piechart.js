vars.default_params["piechart"] = function(scope) {

  var params = {};

  params.accessor_data = function(d) { return d.data; };
  params.accessor_items = function(d) { return d; };

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.width/2, scope.width/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })])
            .nice()
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.height/2, scope.height/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })])
            .nice()
  }];

  params.r_scale = d3.scale.linear()
              .range([0, scope.width/6])
              .domain([0, d3.max(vars.new_data, function(d) { return vars.accessor_data(d)[vars.var_share]; })]);

  params.items = [{
    marks: [{
      type: "arc",
      rotate: "0",
      fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
    }]
  }];

  params.x_axis_show = false;
  params.x_grid_show = false;
  
  params.y_axis_show = false;
  params.y_grid_show = false;
  
  return params;

};

/*
        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark)
                        .select("*")
                        .attr("transform", function(d) { 
                          return "translate(" + arc.centroid(d) + ")"; 
                        });
*/
