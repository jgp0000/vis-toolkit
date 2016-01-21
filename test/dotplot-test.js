var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div></body></html>',
  features: { QuerySelector:true }, //you need query selector for D3 to work
  scripts: ["https://cid-harvard.github.io/vis-toolkit/js/d3.js",
    "https://cid-harvard.github.io/vis-toolkit/build/vistk.js"],
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;

    var data = [{__id: 'A'}, {__id: 'B'}, {__id: 'C'}];

    var visualization = vistk.viz()
        .params({
          dev: true,
          data: data,
          width: 800,
          height: 500,
          type: 'dotplot',
          var_x: '__id',
          var_y: function() { return this.height/2; },
          var_text: '__value'
        });

    d3.select("#viz").call(visualization);

    test('we should have 3 circles', function (t) {

      t.plan(1);
      t.equal(d3.selectAll('circle')[0].length, 3);

    });

  }
});
