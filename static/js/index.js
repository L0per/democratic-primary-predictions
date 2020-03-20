/*
TODO:
- Check data labels after drilling. Label rank? New positions?
*/
function getRandomInt(max,num) {
  return Math.floor(Math.random() * Math.floor(max) -num);
}
d3.json('http://127.0.0.1:5000/api/state_results').then(function(state_result, error) {
  d3.json('http://127.0.0.1:5000/api/county_results').then(function(county_result,error) {

    var data = Highcharts.geojson(Highcharts.maps['countries/us/us-all']),
      separators = Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'mapline'),
      // Some responsiveness
      small = $('#container').width() < 400;

    let item;
    // Set drilldown pointers
    $.each(data, function (i) {
      this.drilldown = this.properties['hc-key'];
      item  = data[i].properties['hc-a2'];
      state_result[0]['results'].forEach(x => {
        if (x.state === item) {
          if (x.predicted_winner === 'Biden') {
            this.value = 0;
          }
          else if (x.predicted_winner === 'Sanders') {
            this.value = 1;
          }
          else {
            this.value =2;
          }
        }

      });


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
                    county_result[0]['results'].forEach(x => {
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
      color:'pink',
      from:2,
      name:'Used in Model',
      to:2,
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
})


d3.json('http://127.0.0.1:5000/api/state_results').then(function(state_result, error) {
  d3.json('http://127.0.0.1:5000/api/county_results').then(function(county_result,error) {

    var data = Highcharts.geojson(Highcharts.maps['countries/us/us-all']),
      separators = Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'mapline'),
      // Some responsiveness
      small = $('#container2').width() < 400;


      let item;
      // Set drilldown pointers
      $.each(data, function (i) {
        this.drilldown = this.properties['hc-key'];
        item  = data[i].properties['hc-a2'];
        state_result[0]['results'].forEach(x => {
          if (x.state === item) {
            if (x.actual_winner === 'Biden') {
              this.value = 0;
            }
            else if (x.actual_winner === 'Sanders') {
              this.value = 1;
            }
            else {
              this.value =-1;
            }
          }

        });


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
                    county_result[0]['results'].forEach(x => {

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

  xAxis: [
    {
      categories: [""]
    },
    {
      linkedTo: 0,
      categories: ["Percent Vote Correlation"],
      opposite: true
    }
  ],

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
      [0, "#0079ff"],
      [0.25, "#abb9ff"],
      [0.5, "#ffffff"],
      [0.75, "#ff9d81"],
      [1, "#f90000"]
    ],
    max: 0.55,
    min: -0.56,
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
    followPointer: true,
    formatter: function() {
      return "<b>" + Highcharts.numberFormat(this.point.value, 2) + "</b>";
    }
  },

  series: [
    {
      borderWidth: 0,
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
        style: {
          textOutline: 0
        },
        enabled: true,
        color: "#000000",
        formatter: function() {
          return "<b>" + getPointCategoryName(this.point, "y") + "</b>";
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

///////////////////////////////////////////////////
// Biden Heat Map
///////////////////////////////////////////////////

function getPointCategoryName(point, dimension) {
  var series = point.series,
    isY = dimension === "y",
    axis = series[isY ? "yAxis" : "xAxis"];
  return axis.categories[point[isY ? "y" : "x"]];
}

Highcharts.chart("bidenHeatmap", {
  chart: {
    type: "heatmap",
    marginTop: 60,
    marginBottom: 80,
    plotBorderWidth: 1
  },

  title: {
    text: "Biden",
    x: -30
  },

  xAxis: [
    {
      categories: [""]
    },
    {
      linkedTo: 0,
      categories: ["Percent Vote Correlation"],
      opposite: true
    }
  ],

  yAxis: {
    categories: [
      "Black",
      "Black-owned firms",
      "Poverty",
      "Living in same house 1+ year",
      "Travel time to work",
      "Female",
      "Homeownership rate",
      "Age over 65",
      "American Indian and Alaska Native-owned firms",
      "Age under 18",
      "Women-owned firms",
      "Persons per household",
      "Population per square mile",
      "Age under 5",
      "Change in private employment",
      "American Indian and Alaka Native",
      "Merchant wholesaler sales",
      "Manufacturers shupments",
      "Native Hawaiian and Pacific Islander-owned firms",
      "Nonemployer establishments",
      "Building permits",
      "Asian-owned firms",
      "Private employment",
      "Total number of firms",
      "Accommodation and food services sales",
      "Population, 2010 (April 1) estimates base",
      "Population 2010",
      "Population, 2014 estimate",
      "Households",
      "Private establishments",
      "Housing Units",
      "White, not Hispanic or Latino",
      "Retail sales",
      "Veteran",
      "Two or more races",
      "Retail sales per capita",
      "Native Hawaiian or Pacific Islander",
      "Hispanic-owned firms",
      "Land area",
      "Asian",
      "Percent change population",
      "High school graduate, age 25+",
      "Housing units in multi-unit structures",
      "Per capita income",
      "Hispanic or Latino",
      "Median house value",
      "Median household income",
      "Foreign language",
      "Bachelor's degree, age 25+",
      "Foreign born",
      "White"
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
      [0, "#0079ff"],
      [0.25, "#abb9ff"],
      [0.5, "#ffffff"],
      [0.75, "#ff9d81"],
      [1, "#f90000"]
    ],
    max: 0.55,
    min: -0.56,
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
    followPointer: true,
    formatter: function() {
      return "<b>" + Highcharts.numberFormat(this.point.value, 2) + "</b>";
    }
  },

  series: [
    {
      borderWidth: 0,
      data: [
        [0, 0, 0.5494742287569667],
        [0, 1, 0.3262760587450224],
        [0, 2, 0.28579067315963536],
        [0, 3, 0.2603624898010897],
        [0, 4, 0.2127088107860216],
        [0, 5, 0.18080010499139612],
        [0, 6, 0.1690794705774919],
        [0, 7, 0.14925758227630984],
        [0, 8, -0.0074185371216185505],
        [0, 9, -0.033349692380899125],
        [0, 10, -0.0347324467728185],
        [0, 11, -0.05527140552392148],
        [0, 12, -0.0602910142112715],
        [0, 13, -0.06361154740567179],
        [0, 14, -0.06528341925131279],
        [0, 15, -0.08652057032895973],
        [0, 16, -0.08968518344857322],
        [0, 17, -0.0904590491904661],
        [0, 18, -0.11633723427286047],
        [0, 19, -0.13164333135638817],
        [0, 20, -0.13501389901317315],
        [0, 21, -0.1358128309536151],
        [0, 22, -0.13741988941909852],
        [0, 23, -0.13895082003348766],
        [0, 24, -0.14164295454345993],
        [0, 25, -0.14194195105430304],
        [0, 26, -0.14194851179012435],
        [0, 27, -0.1436810997012898],
        [0, 28, -0.14375860016917907],
        [0, 29, -0.14557181029951305],
        [0, 30, -0.14579744544725903],
        [0, 31, -0.14637789444254037],
        [0, 32, -0.14919679255652243],
        [0, 33, -0.1568956955030429],
        [0, 34, -0.16029835924003372],
        [0, 35, -0.1713315129258881],
        [0, 36, -0.20357839906204125],
        [0, 37, -0.22205831815184313],
        [0, 38, -0.22803307958359367],
        [0, 39, -0.23206344941276574],
        [0, 40, -0.24515506145717042],
        [0, 41, -0.28869776548191717],
        [0, 42, -0.2896562383469938],
        [0, 43, -0.29079042099371916],
        [0, 44, -0.309577768702916],
        [0, 45, -0.31787439576591964],
        [0, 46, -0.3197354272202843],
        [0, 47, -0.33701647586533623],
        [0, 48, -0.34079367419042017],
        [0, 49, -0.3484349690601851],
        [0, 50, -0.46881156057935147]
      ],
      dataLabels: {
        style: {
          textOutline: 0
        },
        enabled: true,
        color: "#000000",
        formatter: function() {
          return "<b>" + getPointCategoryName(this.point, "y") + "</b>";
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
