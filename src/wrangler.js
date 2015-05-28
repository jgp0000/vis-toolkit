    // Get a copy of the whole dataset
    vars.new_data = vars.data;

    // Filter data by time
    if(typeof vars.time !== "undefined" && typeof vars.time.current_time !== "undefined" && vars.time.current_time != null) {

      console.log("[time.filter]", vars.time.var_time, vars.time.current_time);

      vars.new_data = vars.new_data.filter(function(d) {
        return d[vars.time.var_time] === vars.time.current_time;
      });

    }



    // Init
    if(vars.focus.length > 0) {
      
      vars.new_data.forEach(function(d, i) {
          if(i === vars.focus[0]) {
            d.focus = true;
          } else {
            d.focus = false;
          }
        });
    }

    // Filter data by attribute
    // TODO: not sure we should remove data, but add an attribute instead would better
    if(vars.filter.length > 0) {

      vars.new_data = vars.new_data.filter(function(d) {
        // We don't keep values that are not in the vars.filter array
        return vars.filter.indexOf(d[vars.var_group]) > -1;
      });
    
    }

    // Aggregate data
    if(vars.aggregate === vars.var_group) {

      // Do the nesting
      // Should make sure it works for a generc dataset
      // Also for time or none-time attributes
      nested_data = d3.nest()
        .key(function(d) {
          return d[vars.var_group];
        })
        .rollup(function(leaves) {

          // Generates a new dataset with aggregated data
          var aggregation = {};

          aggregation[vars.var_text] = leaves[0][vars.var_group];

          aggregation[vars.var_group] = leaves[0][vars.var_group];

          aggregation[vars.var_x] = d3.mean(leaves, function(d) {
            return d[vars.var_x];
          });

          aggregation[vars.var_y] = d3.mean(leaves, function(d) {
            return d[vars.var_y];
          });

          aggregation.piescatter = [];
          aggregation.piescatter[0] = {};
          aggregation.piescatter[1] = {};

          aggregation.piescatter[0].nb_products = d3.sum(leaves, function(d) {
            if(d[vars.var_y] >= 30)
              return d[vars.var_x];
            else
              return 0;
          });

          aggregation.piescatter[1].nb_products = d3.sum(leaves, function(d) {
            if(d[vars.var_y] < 30)
              return d[vars.var_x];
            else
              return 0;
          });

          vars.columns.forEach(function(c) {
            if(c === vars.var_text || c === vars.var_group) {
              return;
            }

            aggregation[c] = d3.mean(leaves, function(d) {
              return d[c];
            });
          });

          return aggregation;
        })
        .entries(vars.new_data);

      // Transform key/value into values tab only
      vars.new_data = nested_data.map(function(d) { return d.values; });
    }

    if(vars.type === "linechart" || vars.type === "sparkline") {

      // Parse data
      vars.new_data.forEach(function(d) {
        d[vars.var_time] = vars.time.parse(d[vars.var_time]);
      });

      var all_years = d3.set(vars.new_data.map(function(d) { return d.year; })).values();

      var unique_items = d3.set(vars.new_data.map(function(d) { return d[vars.var_text]; })).values();

      // Find unique items and create ids
      var items = unique_items.map(function(c) {
        return {
          id: c.replace(" ", "_"),
          name: c,
          values: vars.new_data.filter(function(d) {
            return d[vars.var_text] === c;
          }).map(function (d) {
            return {date: vars.time.parse(d.year), rank: +d.rank, year: d.year};
          })
        };
      });

      // Make sure all items and all ranks are there
      items.forEach(function(c) {

        all_years.forEach(function(y) {
          var is_year = false;
          c.values.forEach(function(v) {
            if(v.year === y) {
              is_year = true;
            }
          });
          if(!is_year) {
            c.values.push({date: vars.time.parse(y), rank: null, year: y});
          }
        });

      });
    }

    if(vars.type === "stacked") {


      var stack = d3.layout.stack()
          .values(function(d) { return d.values; });

      // Find the number or years

      unique_years = d3.set(vars.data.data.map(function(d) { return d.year;})).values();

      data = [];

      unique_years.forEach(function(d) {

        a = {};

        vars.data.data.filter(function(e) {
          return e.year == d;
        })
        .map(function(e) {
          a[e.abbrv] = e.share;
    //      return a;
        })

        a.date = vars.time.parse(d);
        data = data.concat(a);

      });

      vars.new_data = stack(d3.keys(data[0]).filter(function(key) { return key !== "date"; }).map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {date: d.date, y: d[name]};
          })
        };
      }));


    }

    if(vars.type === "treemap") {

      // Create the root node
      vars.r = {};
      vars.r.name = "root";
      vars.r.depth = 0;
      var groups = [];

      // Creates the groups here
      vars.new_data.map(function(d, i) {

        if(typeof groups[d[vars.var_group]] === "undefined") {
          groups[d[vars.var_group]] = [];
        }

        groups[d[vars.var_group]]
         .push({name: d.name, size: d.value, attr: d.item_id, group: +d[vars.var_group], year: d.year, id: i, focus: d.focus});

      });

      // Make sure there is no empty elements
      groups = groups.filter(function(n) { return n !== "undefined"; }); 
      
      // Creates the parent nodes
      var parents = groups.map(function(d, i) {

        node = {};
        node.name = d[0].name;
        node.group = d[0].group;

        // Create the children nodes
        node.children = d.map(function(e, j) {
          return {name: e.name, size: e.size, group: e.group, year: e.year, id: e.id, focus: e.focus};
        });

        return node;
      });

      // Add parents to the root
      vars.r.children = parents;

    }
 
    selection.each(function() {

      switch(vars.type) {

        case 'undefined':

        // Basic dump of the data we have
         vars.svg.append("span")
          .html(JSON.stringify(vars.data));

        break;
