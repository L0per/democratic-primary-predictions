/*
TODO:
- Check data labels after drilling. Label rank? New positions?
*/
function getRandomInt(max,num) {
  return Math.floor(Math.random() * Math.floor(max) -num);
}

d3.json('http://127.0.0.1:5000/api/results').then(function(result,error) {

  var data = Highcharts.geojson(Highcharts.maps['countries/us/us-all']),
    separators = Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'mapline'),
    // Some responsiveness
    small = $('#container').width() < 400;


  // Set drilldown pointers
  $.each(data, function (i) {
    this.drilldown = this.properties['hc-key'];
    this.value = getRandomInt(2,0); // Non-random bogus data
  });

  // Instantiate the map
  Highcharts.mapChart('container', {
    chart: {
      events: {
        drilldown: function (e) {
          if (!e.seriesOptions) {
            var chart = this,
              mapKey = 'countries/us/' + e.point.drilldown + '-all',
              // Handle error, the timeout is cleared on success
              fail = setTimeout(function () {
                if (!Highcharts.maps[mapKey]) {
                  chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);
                  fail = setTimeout(function () {
                    chart.hideLoading();
                  }, 1000);
                }
              }, 3000);
              let state = e.point.drilldown
              let abr = state.split("-")[1]
            // Show the spinner
            chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

            // Load the drilldown map
            $.getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', function () {

              data = Highcharts.geojson(Highcharts.maps[mapKey]);
              $.each(data, function (i) {
                  let fip = data[i].properties.fips.toString();
                  result[0]['results'].forEach(x => {
                    if (fip.includes(x.fip.toString()) && x.state_abrv.toLowerCase() === abr) {
                      if (x.predicted_winner === "Biden") {
                        this.value = 0
                      } else if (x.predicted_winner === "Sanders") {
                        this.value = 1
                      } else {
                        this.value = 2
                      }

                    }
                  })
              });

              // Hide loading and add series
              chart.hideLoading();
              clearTimeout(fail);
              chart.addSeriesAsDrilldown(e.point, {
                name: e.point.name,
                data: data,
                dataLabels: {
                  enabled: true,
                  format: '{point.name}'
                }
              });
            });
          }

          this.setTitle(null, { text: e.point.name });
        },
        drillup: function () {
          this.setTitle(null, { text: '' });
        }
      }
    },

    title: {
      text: 'Predicted Results'
    },

    subtitle: {
      text: '',
      floating: true,
      align: 'right',
      y: 50,
      style: {
        fontSize: '16px'
      }
    },

    legend: small ? {} : {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    colorAxis: {
      dataClasses:[{
      color:'#C03221',
      from:0,
      name:'Biden',
      to:0,
      },
      {
      color:'#1C5D99',
      from:1,
      name:'Sanders',
      to:1,
    },
    {
    color:'#D8DAD3',
    from:-1,
    name:'Undetermined',
    to:-1,
    }]
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    tooltip: {
        formatter: function() {
            // let winner;
            // console.log(this.properties.value)
            return '<b>' + this.key + '</b>';
        }
    },


    plotOptions: {
      map: {
        states: {
          hover: {
            color: '#F1F2EB'
          }
        }
      }
    },

    series: [{
      data: data,
      name: 'USA',
      dataLabels: {
        enabled: true,
        format: '{point.properties.postal-code}'
      }
    }, {
      type: 'mapline',
      data: separators,
      color: 'silver',
      enableMouseTracking: false,
      animation: {
        duration: 500
      }
    }],

    drilldown: {
      activeDataLabelStyle: {
        color: '#FFFFFF',
        textDecoration: 'none',
        textOutline: '1px #000000'
      },
      drillUpButton: {
        relativeTo: 'spacingBox',
        position: {
          x: 0,
          y: 60
        }
      }
    }
  });


})


d3.json('http://127.0.0.1:5000/api/results').then(function(result,error) {

  var data = Highcharts.geojson(Highcharts.maps['countries/us/us-all']),
    separators = Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'mapline'),
    // Some responsiveness
    small = $('#container2').width() < 400;


  // Set drilldown pointers
  $.each(data, function (i) {
    this.drilldown = this.properties['hc-key'];
    this.value = getRandomInt(3,1); // Non-random bogus data
  });

  // Instantiate the map
  Highcharts.mapChart('container2', {
    chart: {
      events: {
        drilldown: function (e) {
          if (!e.seriesOptions) {
            var chart = this,
              mapKey = 'countries/us/' + e.point.drilldown + '-all',
              // Handle error, the timeout is cleared on success
              fail = setTimeout(function () {
                if (!Highcharts.maps[mapKey]) {
                  chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);
                  fail = setTimeout(function () {
                    chart.hideLoading();
                  }, 1000);
                }
              }, 3000);
              let state = e.point.drilldown
              let abr = state.split("-")[1]
            // Show the spinner
            chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

            // Load the drilldown map
            $.getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', function () {

              data = Highcharts.geojson(Highcharts.maps[mapKey]);
              $.each(data, function (i) {
                  this.value = -1
                  let fip = data[i].properties.fips.toString();
                  result[0]['results'].forEach(x => {

                    if (fip.includes(x.fip.toString()) && x.state_abrv.toLowerCase() === abr) {
                      if (x.actual_winner === "Biden") {
                        this.value = 0
                      } else if (x.actual_winner === "Sanders") {
                        this.value = 1
                      } else if (x.actual_winner == "Undetermined"){
                        this.value = -1
                      } else {
                        this.value = -1
                      }
                    }
                  })
              });

              // Hide loading and add series
              chart.hideLoading();
              clearTimeout(fail);
              chart.addSeriesAsDrilldown(e.point, {
                name: e.point.name,
                data: data,
                dataLabels: {
                  enabled: true,
                  format: '{point.name}',
                }
              });
            });
          }

          this.setTitle(null, { text: e.point.name });
        },
        drillup: function () {
          this.setTitle(null, { text: '' });
        }
      }
    },

    title: {
      text: 'Actual Results'
    },

    subtitle: {
      text: '',
      floating: true,
      align: 'right',
      y: 50,
      style: {
        fontSize: '16px'
      }
    },

    legend: small ? {} : {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    colorAxis: {
      dataClasses:[{
      color:'#C03221',
      from:0,
      name:'Biden',
      to:0,
      },
      {
      color:'#1C5D99',
      from:1,
      name:'Sanders',
      to:1,
    },
    {
    color:'#D8DAD3',
    from:-1,
    name:'Undetermined',
    to:-1,
    }]
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    tooltip: {
        formatter: function() {
            // let winner;
            // console.log(this.properties.value)
            return '<b>' + this.key + '</b>';
        }
    },


    plotOptions: {
      map: {
        states: {
          hover: {
            color: '#F1F2EB'
          }
        }
      }
    },

    series: [{
      data: data,
      name: 'USA',
      dataLabels: {
        enabled: true,
        format: '{point.properties.postal-code}'
      }
    }, {
      type: 'mapline',
      data: separators,
      color: 'silver',
      enableMouseTracking: false,
      animation: {
        duration: 500
      }
    }],

    drilldown: {
      activeDataLabelStyle: {
        color: '#FFFFFF',
        textDecoration: 'none',
        textOutline: '1px #000000'

      },
      drillUpButton: {
        relativeTo: 'spacingBox',
        position: {
          x: 0,
          y: 60
        }
      }
    }
  });


})


///////////////////////////////////////////////////
// Bernie Heat Map
///////////////////////////////////////////////////

function getPointCategoryName(point, dimension) {
  var series = point.series,
    isY = dimension === "y",
    axis = series[isY ? "yAxis" : "xAxis"];
  return axis.categories[point[isY ? "y" : "x"]];
}

Highcharts.chart("bernieHeatmap", {
  chart: {
    type: "heatmap",
    marginTop: 60,
    marginBottom: 80,
    plotBorderWidth: 1
  },

  title: {
    text: "Sanders",
    x: -30
  },

  xAxis: [{
    categories: [""]
  }, {
    linkedTo: 0,
    categories: ["Percent Vote Correlation"],
    opposite: true
  }],

  yAxis: {
    categories: [
      "White",
      "Foreign born",
      "Bachelor's degree, age 25+",
      "Foreign language",
      "Median household income",
      "Median house value",
      "Hispanic or Latino",
      "Per capita income",
      "Housing units in multi-unit structures",
      "High school graduate, age 25+",
      "Percent change population",
      "Asian",
      "Land area",
      "Hispanic-owned firms",
      "Native Hawaiian or Pacific Islander",
      "Retail sales per capita",
      "Two or more races",
      "Veteran",
      "Retail sales",
      "White, not Hispanic or Latino",
      "Housing Units",
      "Private establishments",
      "Households",
      "Population, 2014 estimate",
      "Population 2010",
      "Population, 2010 (April 1) estimates base",
      "Accommodation and food services sales",
      "Total number of firms",
      "Private employment",
      "Asian-owned firms",
      "Building permits",
      "Nonemployer establishments",
      "Native Hawaiian and Pacific Islander-owned firms",
      "Manufacturers shupments",
      "Merchant wholesaler sales",
      "American Indian and Alaka Native",
      "Change in private employment",
      "Age under 5",
      "Population per square mile",
      "Persons per household",
      "Women-owned firms",
      "Age under 18",
      "American Indian and Alaska Native-owned firms",
      "Age over 65",
      "Homeownership rate",
      "Female",
      "Travel time to work",
      "Living in same house 1+ year",
      "Poverty",
      "Black-owned firms",
      "Black"
    ],
    title: null,
    reversed: true,
    labels: {
      enabled: false
    }
  },

  accessibility: {
    point: {
      descriptionFormatter: function(point) {
        var ix = point.index + 1,
          xName = getPointCategoryName(point, "x"),
          yName = getPointCategoryName(point, "y"),
          val = point.value;
        return ix + ". " + xName + " sales " + yName + ", " + val + ".";
      }
    }
  },

  colorAxis: {
    stops: [
      [0, "#3060cf"],
      [0.6, "#ffffff"],
      [1, "#c4463a"]
    ],
    min: -0.5614970856060336,
    reversed: false
  },

  legend: {
    align: "right",
    layout: "vertical",
    margin: 0,
    verticalAlign: "top",
    y: 25,
    symbolHeight: 280
  },

  tooltip: {
    formatter: function() {
      return (
        "<b>" +
        this.point.value +
        "</b>"
      );
    }
  },

  series: [
    {
      borderWidth: 1,
      data: [
        [0, 0, 0.47948347198109725],
        [0, 1, 0.3531290765477635],
        [0, 2, 0.344399734358099],
        [0, 3, 0.3413356076131175],
        [0, 4, 0.32407108437138854],
        [0, 5, 0.3217728747318663],
        [0, 6, 0.3130987720202893],
        [0, 7, 0.2944068898669512],
        [0, 8, 0.2942194220032314],
        [0, 9, 0.29413159423681695],
        [0, 10, 0.24724986641942723],
        [0, 11, 0.23477378052062683],
        [0, 12, 0.22943751845183719],
        [0, 13, 0.2239126727066761],
        [0, 14, 0.20666676988341118],
        [0, 15, 0.17142867872470513],
        [0, 16, 0.16395789817131673],
        [0, 17, 0.15857631103090056],
        [0, 18, 0.15047673180851004],
        [0, 19, 0.1495500829831698],
        [0, 20, 0.14771795548977532],
        [0, 21, 0.14708353091334292],
        [0, 22, 0.14690016030946526],
        [0, 23, 0.14501189680816723],
        [0, 24, 0.14318082300345594],
        [0, 25, 0.1431743976328021],
        [0, 26, 0.14280728339066406],
        [0, 27, 0.1401312638969389],
        [0, 28, 0.13867417289823475],
        [0, 29, 0.13762410388375843],
        [0, 30, 0.13644064223590213],
        [0, 31, 0.13274416342524606],
        [0, 32, 0.11728381476147602],
        [0, 33, 0.09136184761297449],
        [0, 34, 0.09034377827944504],
        [0, 35, 0.08839565418773036],
        [0, 36, 0.06867403983623237],
        [0, 37, 0.059418544430942806],
        [0, 38, 0.056270841018644366],
        [0, 39, 0.05513773560339987],
        [0, 40, 0.03220440218204157],
        [0, 41, 0.02962444854818285],
        [0, 42, 0.008297539045341841],
        [0, 43, -0.1466175756286884],
        [0, 44, -0.17175125796276425],
        [0, 45, -0.18444965549918427],
        [0, 46, -0.21541861044015292],
        [0, 47, -0.2661336379291139],
        [0, 48, -0.29200177285715445],
        [0, 49, -0.32589756930345287],
        [0, 50, -0.5614970856060336]
      ],
      dataLabels: {
        enabled: true,
        color: "#000000",
        formatter: function() {
          return (
            "<b>" +
            getPointCategoryName(this.point, "y") +
            "</b>"
          );
        }
      }
    }
  ],

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500
        }
      }
    ]
  }
});