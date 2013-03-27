// Based on http://bl.ocks.org/900762 by John Firebaugh
d3.json("faithful.json", function(faithful) {
  data = faithful;
  var w = 800,
      h = 400,
      x = d3.scale.linear().domain([30, 110]).range([0, w]);
      bins = d3.layout.histogram().frequency(false).bins(x.ticks(60))(data),
      max = d3.max(bins, function(d) { return d.y; }),
      y = d3.scale.linear().domain([0, .1]).range([0, h]),
      kde = science.stats.kde().sample(data);

  var vis = d3.select("body")
    .append("svg")
      .attr("width", w)
      .attr("height", h);

  var bars = vis.selectAll("g.bar")
      .data(bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) {
        return "translate(" + x(d.x) + "," + (h - y(d.y)) + ")";
      });

  bars.append("rect")
      .attr("fill", "steelblue")
      .attr("width", function(d) { return x(d.dx + 30) - 1; })
      .attr("height", function(d) { return y(d.y); });

  var line = d3.svg.line()
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return h - y(d[1]); });

  vis.append("path").attr("d", line(kde(d3.range(30, 110, 10))));
      
});

var tempDataX = [1,2,3,4,5,6,7,8,9,10];
var tempDataY = [10,9,8,7,6,5,4,3,2,1];
var tempDataZ = [1,2,3,4,5,5,4,3,2,1];



var data2D = science.stats.kde2D(tempDataX, tempDataY,tempDataZ, d3.range(0,11,0.1), d3.range(0,11,0.1), 1,1);

var max = d3.max(data2D,function(d){return d3.max(d);});
var min = d3.min(data2D,function(d){return d3.min(d);});


var cliff = -1000;

        
      data2D.push(d3.range(data2D[0].length).map(function() { return cliff; }));
      data2D.unshift(d3.range(data2D[0].length).map(function() { return cliff; }));
      data2D.forEach(function(d) {
        d.push(cliff);
        d.unshift(cliff);
      });
      

      

      var c = new Conrec(),
          xs = d3.range(0, data2D[0].length),
          ys = d3.range(0, data2D.length),
          zs = d3.range(min, max, .1),
          w = 800,
          h = 800,
          x = d3.scale.linear().range([0, w]).domain([0, data2D[0].length]),
          y = d3.scale.linear().range([h, 0]).domain([0, data2D.length]),
          colours = d3.scale.linear().domain([min,max]).range(["#fff", "red"]);

      c.contour(data2D, 0, xs.length-1, 0, ys.length-1, xs, ys, zs.length, zs);

      d3.select("body").append("svg:svg")
          .attr("width", w)
          .attr("height", h)
        .selectAll("path").data(c.contourList())
        .enter().append("svg:path")
          .style("fill",function(d) { return colours(d.level);})
          .style("stroke","black")
          .attr("d",d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); })
          );

