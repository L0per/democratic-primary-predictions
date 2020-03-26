/*
TODO:
- Check data labels after drilling. Label rank? New positions?
*/
function getRandomInt(max,num) {
  return Math.floor(Math.random() * Math.floor(max) -num);
}
d3.json('http://127.0.0.1:5000/api/state_results').then(function(state_result, error) {
  d3.json('http://127.0.0.1:5000/api/county_results').then(function(county_result,error) {

    ///////////////////////////////////////////////
    // Prediction Map
    ///////////////////////////////////////////////

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
        verticalAlign: 'middle',
        backgroundColor: 'rgba(255,0,0,0)'
      },

      colorAxis: {
        dataClasses:[{
        color:'#6b591d',
        from:0,
        name:'Biden',
        to:0,
        },
        {
        color:'#76a21e',
        from:1,
        name:'Sanders',
        to:1,
      },
      {
      color:'rgba(52,53,45)',
      from:2,
      name:'Used in Model',
      to:2,
    },
      {
      color:'#c6cf65',
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

      mapNavigation: {
        enabled: false,
      },

      navigation: {
        buttonOptions: {
            enabled: false
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

    ///////////////////////////////////////////////
    // Actual Results Map
    ///////////////////////////////////////////////

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
        verticalAlign: 'middle',
        backgroundColor: 'rgba(255,0,0,0)'
      },
      colorAxis: {
        dataClasses:[{
        color:'#6b591d',
        from:0,
        name:'Biden',
        to:0,
        },
        {
        color:'#76a21e',
        from:1,
        name:'Sanders',
        to:1,
      },
      {
      color:'rgba(52,53,45)',
      from:-1,
      name:'Election Not Yet Held',
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

      mapNavigation: {
        enabled: false,
      },

      navigation: {
        buttonOptions: {
            enabled: false
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

    

    ///////////////////////////////////////////////////
    // Actual vs Predicted Summary Chart
    ///////////////////////////////////////////////////

    console.log(county_result)

    // create state dictionaries for each candidate and their predicted or actual result
    let sanders_predicted = {};
    let sanders_actual = {};
    let biden_predicted = {};
    let biden_actual = {};
    let stateList = []

    let results = county_result[0].results

    for (const county in results) {

      if (!(results[county].predicted_winner == 'Undetermined')) {

        if (!(results[county].actual_winner == 'Undetermined')) {

          let state = results[county].state_abrv
        
          if (!(stateList.includes(state))) {
            stateList.push(state)
          }
  
          if (results[county].predicted_winner == 'Sanders') {
            sanders_predicted[state] = (sanders_predicted[state]+1) || 1;
          }
          
          if (results[county].actual_winner == 'Sanders') {
            sanders_actual[state] = (sanders_actual[state]+1) || 1;
          }
  
          if (results[county].predicted_winner == 'Biden') {
            biden_predicted[state] = (biden_predicted[state]+1) || 1;
          }
  
          if (results[county].actual_winner == 'Biden') {
            biden_actual[state] = (biden_actual[state]+1) || 1;
          }

        }
      }
    }

    // sort state list
    stateList.sort()

    // create plot series
    let summaryChartSeries = []

    // loop through states
    for (const state in stateList) {
      let sanders_post = {
        'name': '',
        'data': [],
        'stack': 'Sanders'
      }
      let biden_post = {
        'name': '',
        'data': [],
        'stack': 'Biden'
      }

      sanders_post.name = stateList[state]
      biden_post.name = stateList[state]

      if (sanders_predicted[stateList[state]] > 0) {
        sanders_post.data.push(sanders_predicted[stateList[state]])
      }
      else {
        sanders_post.data.push(0)
      }

      if (sanders_predicted[stateList[state]] > 0) {
        sanders_post.data.push(sanders_actual[stateList[state]])
      }
      else {
        sanders_post.data.push(0)
      }

      if (sanders_predicted[stateList[state]] > 0) {
        biden_post.data.push(biden_predicted[stateList[state]])
      }
      else {
        biden_post.data.push(0)
      }

      if (sanders_predicted[stateList[state]] > 0) {
        biden_post.data.push(biden_actual[stateList[state]])
      }
      else {
        biden_post.data.push(0)
      }

      summaryChartSeries.push(sanders_post)
      summaryChartSeries.push(biden_post)

    }

    console.log(summaryChartSeries)

    Highcharts.chart('summaryChart', {

      legend: {
        enabled: false
      },

      chart: {
          type: 'column'
      },
    
      title: {
          text: 'Predicted vs. Actual: Up to 3/17/20 Election Results'
      },

      subtitle: {
        text: 'Each stack block is a state, hover for predicted vs. actual comparison'
      },
    
      xAxis: {
          categories: ['Predicted', 'Actual']
      },
    
      yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
              text: '# of Counties Won'
          },
          stackLabels: {
            style: {
                color: 'white'
            },
            enabled: true,
            formatter: function() {
              return this.stack + ':' + " " + this.total;
            },
          }
      },
    
      tooltip: {
          formatter: function () {
              return '<b>' + this.x + '</b><br/>' +
                  this.series.name + ': ' + this.y + '<br/>' +
                  'Total: ' + this.point.stackTotal;
          }
      },
      
      navigation: {
        buttonOptions: {
            enabled: false
        }
      },

      plotOptions: {
          column: {
              stacking: 'normal',
          },
      },
    
      series: summaryChartSeries
    });

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
    x: 185,
    style: {
      fontSize: '30px'
    }
  },

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

  xAxis: {
    visible: false
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
      [0.2, "#560d0d"],
      [0.5, "#fbffd9"],
      [0.8, "#76a21e"]
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
    y: 45,
    symbolHeight: 280,
    backgroundColor: 'rgba(255,0,0,0)'
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

  navigation: {
    buttonOptions: {
        enabled: false
    }
  },

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
    x: 195,
    style: {
      fontSize: '30px'
    }
  },

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

  xAxis: {
    visible: false
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
      [0.2, "#560d0d"],
      [0.5, "#fbffd9"],
      [0.8, "#76a21e"]
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
    y: 45,
    symbolHeight: 280,
    backgroundColor: 'rgba(255,0,0,0)'
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

  navigation: {
    buttonOptions: {
        enabled: false
    }
  },

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

///////////////////////////////////////////////
// Full Features Heatmap
///////////////////////////////////////////////

function getPointCategoryName(point, dimension) {
  var series = point.series,
    isY = dimension === "y",
    axis = series[isY ? "yAxis" : "xAxis"];
  return axis.categories[point[isY ? "y" : "x"]];
}

Highcharts.chart("fullFeatHeatmap", {
  chart: {
    type: "heatmap",
    marginTop: 60,
    marginBottom: 80,
    plotBorderWidth: 0
  },

  title: {
    text: "All County Demographic Features",
    x: 0
  },

  xAxis: {
    categories: ['Population, 2014 estimate',
    'Population, 2010 (April 1) estimates base',
    'Population, percent change - April 1, 2010 to July 1, 2014',
    'Population, 2010',
    'Persons under 5 years, percent, 2014',
    'Persons under 18 years, percent, 2014',
    'Persons 65 years and over, percent, 2014',
    'Female persons, percent, 2014',
    'White alone, percent, 2014',
    'Black or African American alone, percent, 2014',
    'American Indian and Alaska Native alone, percent, 2014',
    'Asian alone, percent, 2014',
    'Native Hawaiian and Other Pacific Islander alone, percent, 2014',
    'Two or More Races, percent, 2014',
    'Hispanic or Latino, percent, 2014',
    'White alone, not Hispanic or Latino, percent, 2014',
    'Living in same house 1 year & over, percent, 2009-2013',
    'Foreign born persons, percent, 2009-2013',
    'Language other than English spoken at home, pct age 5+, 2009-2013',
    'High school graduate or higher, percent of persons age 25+, 2009-2013',
    "Bachelor's degree or higher, percent of persons age 25+, 2009-2013",
    'Veterans, 2009-2013',
    'Mean travel time to work (minutes), workers age 16+, 2009-2013',
    'Housing units, 2014',
    'Homeownership rate, 2009-2013',
    'Housing units in multi-unit structures, percent, 2009-2013',
    'Median value of owner-occupied housing units, 2009-2013',
    'Households, 2009-2013',
    'Persons per household, 2009-2013',
    'Per capita money income in past 12 months (2013 dollars), 2009-2013',
    'Median household income, 2009-2013',
    'Persons below poverty level, percent, 2009-2013',
    'Private nonfarm establishments, 2013',
    'Private nonfarm employment,  2013',
    'Private nonfarm employment, percent change, 2012-2013',
    'Nonemployer establishments, 2013',
    'Total number of firms, 2007',
    'Black-owned firms, percent, 2007',
    'American Indian- and Alaska Native-owned firms, percent, 2007',
    'Asian-owned firms, percent, 2007',
    'Native Hawaiian- and Other Pacific Islander-owned firms, percent, 2007',
    'Hispanic-owned firms, percent, 2007',
    'Women-owned firms, percent, 2007',
    'Manufacturers shipments, 2007 ($1,000)',
    'Merchant wholesaler sales, 2007 ($1,000)',
    'Retail sales, 2007 ($1,000)',
    'Retail sales per capita, 2007',
    'Accommodation and food services sales, 2007 ($1,000)',
    'Building permits, 2014',
    'Land area in square miles, 2010',
    'Population per square mile, 2010'],
    labels: {
      enabled: false
    },
    visible: false
  },

  yAxis: {
    categories: ['Population, 2014 estimate',
    'Population, 2010 (April 1) estimates base',
    'Population, percent change - April 1, 2010 to July 1, 2014',
    'Population, 2010',
    'Persons under 5 years, percent, 2014',
    'Persons under 18 years, percent, 2014',
    'Persons 65 years and over, percent, 2014',
    'Female persons, percent, 2014',
    'White alone, percent, 2014',
    'Black or African American alone, percent, 2014',
    'American Indian and Alaska Native alone, percent, 2014',
    'Asian alone, percent, 2014',
    'Native Hawaiian and Other Pacific Islander alone, percent, 2014',
    'Two or More Races, percent, 2014',
    'Hispanic or Latino, percent, 2014',
    'White alone, not Hispanic or Latino, percent, 2014',
    'Living in same house 1 year & over, percent, 2009-2013',
    'Foreign born persons, percent, 2009-2013',
    'Language other than English spoken at home, pct age 5+, 2009-2013',
    'High school graduate or higher, percent of persons age 25+, 2009-2013',
    "Bachelor's degree or higher, percent of persons age 25+, 2009-2013",
    'Veterans, 2009-2013',
    'Mean travel time to work (minutes), workers age 16+, 2009-2013',
    'Housing units, 2014',
    'Homeownership rate, 2009-2013',
    'Housing units in multi-unit structures, percent, 2009-2013',
    'Median value of owner-occupied housing units, 2009-2013',
    'Households, 2009-2013',
    'Persons per household, 2009-2013',
    'Per capita money income in past 12 months (2013 dollars), 2009-2013',
    'Median household income, 2009-2013',
    'Persons below poverty level, percent, 2009-2013',
    'Private nonfarm establishments, 2013',
    'Private nonfarm employment,  2013',
    'Private nonfarm employment, percent change, 2012-2013',
    'Nonemployer establishments, 2013',
    'Total number of firms, 2007',
    'Black-owned firms, percent, 2007',
    'American Indian- and Alaska Native-owned firms, percent, 2007',
    'Asian-owned firms, percent, 2007',
    'Native Hawaiian- and Other Pacific Islander-owned firms, percent, 2007',
    'Hispanic-owned firms, percent, 2007',
    'Women-owned firms, percent, 2007',
    'Manufacturers shipments, 2007 ($1,000)',
    'Merchant wholesaler sales, 2007 ($1,000)',
    'Retail sales, 2007 ($1,000)',
    'Retail sales per capita, 2007',
    'Accommodation and food services sales, 2007 ($1,000)',
    'Building permits, 2014',
    'Land area in square miles, 2010',
    'Population per square mile, 2010'],
    title: null,
    reversed: true,
    labels: {
      enabled: false
    },
    visible: false
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
      [0, "#560d0d"],
      [0.5, "#fbffd9"],
      [1, "#76a21e"]
    ],
    max: 0.55,
    min: -0.56,
    reversed: false
  },

  legend: {
    // align: "right",
    // layout: "vertical",
    // margin: 0,
    verticalAlign: "top",
    // y: 25,
    // symbolHeight: 280
    backgroundColor: 'rgba(255,0,0,0)'
  },

  tooltip: {
    followPointer: true,
    formatter: function() {
      return "<b>" + Highcharts.numberFormat(this.point.value, 2) + '<br>' + getPointCategoryName(this.point, 'x') + '<br>' + getPointCategoryName(this.point, 'y') + "</b>";
    }
  },

//   tooltip: {
//     formatter: function () {
//         return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
//             this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
//     }
// },

  series: [
    {
      borderWidth: 0,
      data: [
        [0, 0, 1.0],
 [0, 1, 0.9996689750288797],
 [0, 2, 0.24782893829524205],
 [0, 3, 0.9996684631630675],
 [0, 4, 0.12247473534132698],
 [0, 5, 0.08539000866391688],
 [0, 6, -0.24584864387225444],
 [0, 7, 0.07181999348730793],
 [0, 8, -0.11103621832207289],
 [0, 9, 0.019861129007010106],
 [0, 10, -0.03048793884120859],
 [0, 11, 0.5189050138129806],
 [0, 12, 0.22382748319970516],
 [0, 13, 0.1501825898961019],
 [0, 14, 0.16275173779407806],
 [0, 15, -0.20307196143472991],
 [0, 16, -0.12783475614609394],
 [0, 17, 0.4198209819919798],
 [0, 18, 0.2725063034624672],
 [0, 19, 0.056599687927178934],
 [0, 20, 0.2748163443637617],
 [0, 21, 0.9363570163733123],
 [0, 22, 0.08741625675098916],
 [0, 23, 0.9955761210839229],
 [0, 24, -0.27850227911040615],
 [0, 25, 0.39169909117272805],
 [0, 26, 0.2998522546409696],
 [0, 27, 0.9970486716504616],
 [0, 28, 0.1783509217650356],
 [0, 29, 0.2282218067847098],
 [0, 30, 0.24143860727075495],
 [0, 31, -0.06617263607130194],
 [0, 32, 0.9869953403666881],
 [0, 33, 0.9784605158254804],
 [0, 34, 0.06027628488224243],
 [0, 35, 0.9899209457984661],
 [0, 36, 0.9903691437509022],
 [0, 37, 0.10035598797185911],
 [0, 38, 0.034820721616857814],
 [0, 39, 0.5935977222643686],
 [0, 40, 0.49655458104557293],
 [0, 41, 0.2472444643336805],
 [0, 42, 0.19485471991911374],
 [0, 43, 0.8703718844184166],
 [0, 44, 0.8888964058554745],
 [0, 45, 0.9900043739507037],
 [0, 46, 0.1352728422826648],
 [0, 47, 0.8322932555567589],
 [0, 48, 0.7657624089690778],
 [0, 49, 0.13312601321080558],
 [0, 50, 0.3067912020205461],
 [1, 1, 1.0],
 [1, 2, 0.23915388846988958],
 [1, 3, 0.9999998677887588],
 [1, 4, 0.11979746856444745],
 [1, 5, 0.08262026474056926],
 [1, 6, -0.24212986563909383],
 [1, 7, 0.07239647417858734],
 [1, 8, -0.11128530238975812],
 [1, 9, 0.02110313288485977],
 [1, 10, -0.030297376978155918],
 [1, 11, 0.5133324501573735],
 [1, 12, 0.22163409581633403],
 [1, 13, 0.14906180646472797],
 [1, 14, 0.1600452650311098],
 [1, 15, -0.2012722487314062],
 [1, 16, -0.125349470046639],
 [1, 17, 0.4152072932411842],
 [1, 18, 0.2691143112160147],
 [1, 19, 0.05514645215825701],
 [1, 20, 0.2699392991379305],
 [1, 21, 0.9338707179342581],
 [1, 22, 0.08618809532255824],
 [1, 23, 0.9949238911070669],
 [1, 24, -0.27731281377146555],
 [1, 25, 0.38906400801338403],
 [1, 26, 0.29753541643296944],
 [1, 27, 0.9967865019690607],
 [1, 28, 0.17586016669039384],
 [1, 29, 0.2240386245627677],
 [1, 30, 0.23644102516770693],
 [1, 31, -0.06362239517154125],
 [1, 32, 0.9872195085832189],
 [1, 33, 0.9771652438385856],
 [1, 34, 0.058536521974492495],
 [1, 35, 0.9906076362809964],
 [1, 36, 0.9914862648785593],
 [1, 37, 0.10122485483762085],
 [1, 38, 0.03481868620375071],
 [1, 39, 0.5886614460962634],
 [1, 40, 0.49535494997413915],
 [1, 41, 0.24394647885215284],
 [1, 42, 0.19445429145539989],
 [1, 43, 0.8682136388953088],
 [1, 44, 0.8859901955587277],
 [1, 45, 0.98917268142168],
 [1, 46, 0.13368909260065678],
 [1, 47, 0.8308056822501508],
 [1, 48, 0.7518345317576601],
 [1, 49, 0.13123229257761576],
 [1, 50, 0.30479969045085936],
 [2, 2, 1.0],
 [2, 3, 0.2391466085804399],
 [2, 4, 0.31661268534509585],
 [2, 5, 0.30284194122400776],
 [2, 6, -0.5128848555379655],
 [2, 7, 0.0534371561574885],
 [2, 8, 0.09155922389020839],
 [2, 9, -0.1656084419012714],
 [2, 10, -0.018694294412465392],
 [2, 11, 0.3676433764672444],
 [2, 12, 0.22429018150876776],
 [2, 13, 0.17780198585956042],
 [2, 14, 0.22533273553569352],
 [2, 15, -0.09195012506456696],
 [2, 16, -0.31040713238261963],
 [2, 17, 0.3828397287407309],
 [2, 18, 0.29162929033928553],
 [2, 19, 0.21742241237961885],
 [2, 20, 0.5021306562738775],
 [2, 21, 0.30593166862601867],
 [2, 22, 0.11130220578035199],
 [2, 23, 0.25821002838494517],
 [2, 24, -0.20212820232169273],
 [2, 25, 0.37249818425038406],
 [2, 26, 0.41475776695106426],
 [2, 27, 0.2526993028754206],
 [2, 28, 0.34784122713716353],
 [2, 29, 0.4349222302091862],
 [2, 30, 0.5486969155662212],
 [2, 31, -0.3041549164594311],
 [2, 32, 0.23755042913251398],
 [2, 33, 0.2375192181375926],
 [2, 34, 0.196273580739032],
 [2, 35, 0.22041590382507603],
 [2, 36, 0.2234801026745834],
 [2, 37, -0.04545708108836403],
 [2, 38, 0.04280649513295847],
 [2, 39, 0.3396132666665546],
 [2, 40, 0.16071219541824272],
 [2, 41, 0.2540548473478041],
 [2, 42, 0.2525286581667441],
 [2, 43, 0.1796962568126039],
 [2, 44, 0.1565090770106964],
 [2, 45, 0.25148286014485377],
 [2, 46, 0.3134426358769995],
 [2, 47, 0.19890262236471584],
 [2, 48, 0.35286528348879886],
 [2, 49, 0.055041572655377506],
 [2, 50, 0.24364461315527183],
 [3, 3, 1.0],
 [3, 4, 0.11980221592539386],
 [3, 5, 0.08262397605328657],
 [3, 6, -0.24213127870849857],
 [3, 7, 0.07238836309355069],
 [3, 8, -0.11128514187152759],
 [3, 9, 0.021101319022605557],
 [3, 10, -0.03029447008187656],
 [3, 11, 0.5133368839681131],
 [3, 12, 0.2216417590696047],
 [3, 13, 0.14906473769187048],
 [3, 14, 0.160052253750872],
 [3, 15, -0.20127736632582308],
 [3, 16, -0.1253553870530122],
 [3, 17, 0.415212054687798],
 [3, 18, 0.26912060038397734],
 [3, 19, 0.0551368463820778],
 [3, 20, 0.2699237464664124],
 [3, 21, 0.9338677095857961],
 [3, 22, 0.0861837476960218],
 [3, 23, 0.9949221010191],
 [3, 24, -0.2773246436486572],
 [3, 25, 0.38906529674959855],
 [3, 26, 0.2975295178001868],
 [3, 27, 0.9967857402699263],
 [3, 28, 0.17586748946587535],
 [3, 29, 0.22402312070732291],
 [3, 30, 0.23643032289636456],
 [3, 31, -0.06360906998072009],
 [3, 32, 0.9872218937163288],
 [3, 33, 0.9771653282288606],
 [3, 34, 0.05853868729295812],
 [3, 35, 0.9906086293517888],
 [3, 36, 0.9914882952043091],
 [3, 37, 0.10122221461106579],
 [3, 38, 0.034818770654723774],
 [3, 39, 0.5886632126888715],
 [3, 40, 0.4953568947833871],
 [3, 41, 0.24394794252058236],
 [3, 42, 0.19444959792435912],
 [3, 43, 0.8681958036326738],
 [3, 44, 0.885979357198319],
 [3, 45, 0.9891741956753468],
 [3, 46, 0.1336959720236647],
 [3, 47, 0.8308090118230739],
 [3, 48, 0.7518235002721364],
 [3, 49, 0.13123403454554636],
 [3, 50, 0.30480046007596256],
 [4, 4, 1.0],
 [4, 5, 0.8718613430831322],
 [4, 6, -0.6172572261206584],
 [4, 7, 0.13427216291789132],
 [4, 8, -0.12956527754966884],
 [4, 9, 0.07769460383209006],
 [4, 10, 0.1022400604101808],
 [4, 11, 0.12075973745560098],
 [4, 12, 0.21735987708016272],
 [4, 13, 0.08604918366082037],
 [4, 14, 0.4463806312061944],
 [4, 15, -0.43345004341684157],
 [4, 16, -0.19626175070016053],
 [4, 17, 0.3741347362887202],
 [4, 18, 0.4499691690091679],
 [4, 19, -0.25858700635399084],
 [4, 20, -0.07293244618427289],
 [4, 21, 0.1332804780441461],
 [4, 22, -0.20740782754457593],
 [4, 23, 0.11391873268506506],
 [4, 24, -0.32476422855760123],
 [4, 25, 0.17122662422443588],
 [4, 26, -0.12421764086617737],
 [4, 27, 0.11539945013117024],
 [4, 28, 0.5968143218317787],
 [4, 29, -0.12446885125246356],
 [4, 30, 0.06334664924952196],
 [4, 31, 0.13199624293364243],
 [4, 32, 0.10102190018962465],
 [4, 33, 0.11142402496260079],
 [4, 34, 0.05739896309951288],
 [4, 35, 0.09666431144428403],
 [4, 36, 0.09492773717077035],
 [4, 37, 0.10479841508133583],
 [4, 38, 0.09523217002431329],
 [4, 39, 0.16161580819271745],
 [4, 40, 0.10443168782877632],
 [4, 41, 0.3253998827535218],
 [4, 42, 0.11121110602372523],
 [4, 43, 0.09497791445188768],
 [4, 44, 0.08424589671467167],
 [4, 45, 0.11589434787134113],
 [4, 46, 0.16031629433818756],
 [4, 47, 0.07776125315839034],
 [4, 48, 0.1436449930061432],
 [4, 49, 0.08878279916895696],
 [4, 50, 0.07495516480894931],
 [5, 5, 1.0],
 [5, 6, -0.5798574055915346],
 [5, 7, 0.16738320305694818],
 [5, 8, -0.025101213948268867],
 [5, 9, -0.008847815886418487],
 [5, 10, 0.09824605388059753],
 [5, 11, 0.038439093191863186],
 [5, 12, 0.1698492324583732],
 [5, 13, 0.03275440777904842],
 [5, 14, 0.40772739464799845],
 [5, 15, -0.3243019553058903],
 [5, 16, -0.00036429925974183774],
 [5, 17, 0.3057400838110682],
 [5, 18, 0.39461629452758457],
 [5, 19, -0.21562669453861236],
 [5, 20, -0.12841786114134612],
 [5, 21, 0.08645801358979643],
 [5, 22, -0.0876717183825381],
 [5, 23, 0.06994413183593445],
 [5, 24, -0.08488712855522455],
 [5, 25, -0.01998666389720336],
 [5, 26, -0.15399236352408593],
 [5, 27, 0.07293329727336528],
 [5, 28, 0.6916186091390214],
 [5, 29, -0.11175694349053644],
 [5, 30, 0.14211213279899623],
 [5, 31, 0.01593437556410599],
 [5, 32, 0.05538397685041195],
 [5, 33, 0.059463862389658485],
 [5, 34, 0.07221040116332887],
 [5, 35, 0.06369258359383265],
 [5, 36, 0.059266043194127996],
 [5, 37, 0.05049549221078608],
 [5, 38, 0.07923988140253549],
 [5, 39, 0.08494205325491329],
 [5, 40, 0.07448841070284869],
 [5, 41, 0.2984345141152509],
 [5, 42, 0.06932304359992866],
 [5, 43, 0.06736935565325627],
 [5, 44, 0.05277546233495204],
 [5, 45, 0.07187739092119991],
 [5, 46, 0.03552871084446892],
 [5, 47, 0.03141729368776138],
 [5, 48, 0.11061859122004272],
 [5, 49, 0.07874247910401161],
 [5, 50, -0.06368524926732155],
 [6, 6, 1.0],
 [6, 7, 0.09554003895607784],
 [6, 8, 0.2561962366800521],
 [6, 9, -0.19011153903989575],
 [6, 10, -0.003736874419822793],
 [6, 11, -0.3344676587748005],
 [6, 12, -0.2362360797611918],
 [6, 13, -0.13917225968131955],
 [6, 14, -0.295833537369241],
 [6, 15, 0.4185908435127034],
 [6, 16, 0.43144878223025523],
 [6, 17, -0.42139438827878267],
 [6, 18, -0.3525338138067991],
 [6, 19, 0.08164143234301],
 [6, 20, -0.2657282384214304],
 [6, 21, -0.283390936227319],
 [6, 22, -0.005964894033270497],
 [6, 23, -0.24709325112815123],
 [6, 24, 0.46922884628458705],
 [6, 25, -0.4768373148332644],
 [6, 26, -0.17862878817252345],
 [6, 27, -0.24826993233260913],
 [6, 28, -0.6060458506568911],
 [6, 29, -0.08291851087698876],
 [6, 30, -0.3275561283669618],
 [6, 31, -0.0381757733301316],
 [6, 32, -0.2256883475923952],
 [6, 33, -0.23597495425292894],
 [6, 34, -0.10308829109297975],
 [6, 35, -0.20871213086203685],
 [6, 36, -0.21242141271534376],
 [6, 37, -0.18623997020627087],
 [6, 38, -0.07242123030660959],
 [6, 39, -0.3248023249351184],
 [6, 40, -0.16564594413982658],
 [6, 41, -0.2876676896550489],
 [6, 42, -0.29982504156491374],
 [6, 43, -0.19717931027401692],
 [6, 44, -0.16357552776988046],
 [6, 45, -0.2424042017205775],
 [6, 46, -0.21319246034687292],
 [6, 47, -0.18455948572522432],
 [6, 48, -0.26875516199899396],
 [6, 49, -0.05504789046654801],
 [6, 50, -0.2342843907846514],
 [7, 7, 1.0],
 [7, 8, -0.16076507636295942],
 [7, 9, 0.17044672090931043],
 [7, 10, -0.05961649743748754],
 [7, 11, 0.042282874903576136],
 [7, 12, -0.03598176899488093],
 [7, 13, 0.002870122694395915],
 [7, 14, -0.22601322710209398],
 [7, 15, 0.041914394241438106],
 [7, 16, 0.176032739649878],
 [7, 17, -0.1247508212794902],
 [7, 18, -0.17576164776303888],
 [7, 19, 0.1204455408565227],
 [7, 20, 0.15375995920451102],
 [7, 21, 0.09522964602650197],
 [7, 22, 0.05846670433521204],
 [7, 23, 0.08370473854039996],
 [7, 24, -0.07525320312213847],
 [7, 25, 0.138315638885728],
 [7, 26, 0.04117268756250624],
 [7, 27, 0.08188014234354407],
 [7, 28, -0.07211802349667747],
 [7, 29, 0.11059767761091219],
 [7, 30, -0.028132319729790026],
 [7, 31, 0.06279499447373985],
 [7, 32, 0.07085934761417502],
 [7, 33, 0.074732317673941],
 [7, 34, -0.052612986419727024],
 [7, 35, 0.06406863869766014],
 [7, 36, 0.06769851091020042],
 [7, 37, 0.22181044336620667],
 [7, 38, -0.007636849674635602],
 [7, 39, 0.09362891804779283],
 [7, 40, 0.013813983532828793],
 [7, 41, -0.048390014685254126],
 [7, 42, 0.2060049885949224],
 [7, 43, 0.07432226526630327],
 [7, 44, 0.04530444448763897],
 [7, 45, 0.07851417714730462],
 [7, 46, 0.187336386927593],
 [7, 47, 0.050649634514473484],
 [7, 48, 0.0580267902745031],
 [7, 49, -0.11184031945190286],
 [7, 50, 0.09959266186822811],
 [8, 8, 1.0],
 [8, 9, -0.9386186676781639],
 [8, 10, -0.16165767675835951],
 [8, 11, -0.1528810333141831],
 [8, 12, -0.03847336168789365],
 [8, 13, -0.13418147698499286],
 [8, 14, 0.148540086249858],
 [8, 15, 0.6720749702870471],
 [8, 16, 0.019231282434575715],
 [8, 17, 0.014840601966622633],
 [8, 18, 0.10137944714232944],
 [8, 19, 0.27895651739214106],
 [8, 20, 0.032973990506698456],
 [8, 21, -0.1283470353436601],
 [8, 22, -0.14070388301347964],
 [8, 23, -0.1183251357612169],
 [8, 24, 0.3544428652091693],
 [8, 25, -0.15803995600545662],
 [8, 26, 0.05534572111135521],
 [8, 27, -0.11718625956826156],
 [8, 28, -0.13373103425314037],
 [8, 29, 0.206464831890134],
 [8, 30, 0.2150597265864424],
 [8, 31, -0.4772613008333946],
 [8, 32, -0.10323317762103834],
 [8, 33, -0.11948672436325211],
 [8, 34, 0.028686398470329562],
 [8, 35, -0.0948139183973239],
 [8, 36, -0.09372223955538811],
 [8, 37, -0.676686842808227],
 [8, 38, -0.18676118026999705],
 [8, 39, -0.2165743199817495],
 [8, 40, -0.08855106839168393],
 [8, 41, 0.04424451269995721],
 [8, 42, -0.22609880181338227],
 [8, 43, -0.11211093108565996],
 [8, 44, -0.09407075398825945],
 [8, 45, -0.11104831836256418],
 [8, 46, 0.02518387315020872],
 [8, 47, -0.10171547535504293],
 [8, 48, -0.09556005406178746],
 [8, 49, 0.06412060614623065],
 [8, 50, -0.17944577924885113],
 [9, 9, 1.0],
 [9, 10, -0.12481108400092175],
 [9, 11, -0.028237016710071314],
 [9, 12, -0.07118183677647127],
 [9, 13, -0.16102844686550818],
 [9, 14, -0.18094363710233002],
 [9, 15, -0.605782552204106],
 [9, 16, 0.0530797269784721],
 [9, 17, -0.12723242755993028],
 [9, 18, -0.17144493153201223],
 [9, 19, -0.3273588691230095],
 [9, 20, -0.11968986815531797],
 [9, 21, 0.03032086324007714],
 [9, 22, 0.15120577823445597],
 [9, 23, 0.026349052961753053],
 [9, 24, -0.2709361639177719],
 [9, 25, 0.0774431815531472],
 [9, 26, -0.16017319124066615],
 [9, 27, 0.024462736196097425],
 [9, 28, 0.08670256784788426],
 [9, 29, -0.27235278032866606],
 [9, 30, -0.29441276077461764],
 [9, 31, 0.4954042576970977],
 [9, 32, 0.012299883415603077],
 [9, 33, 0.02886686247604652],
 [9, 34, -0.03741451185276867],
 [9, 35, 0.012181958228412974],
 [9, 36, 0.008033230338368181],
 [9, 37, 0.7036642670663059],
 [9, 38, -0.0318951098454524],
 [9, 39, 0.0595439534639427],
 [9, 40, -0.007441081979913861],
 [9, 41, -0.07331097567515293],
 [9, 42, 0.18466403061982434],
 [9, 43, 0.045886472745458484],
 [9, 44, 0.024788757159356998],
 [9, 45, 0.01837171954324143],
 [9, 46, -0.059228449213191876],
 [9, 47, 0.017298228044126063],
 [9, 48, 0.019669569059568667],
 [9, 49, -0.10582349680760092],
 [9, 50, 0.09209045095769433],
 [10, 10, 1.0],
 [10, 11, -0.04067798622611659],
 [10, 12, 0.04933023066192576],
 [10, 13, 0.6798198283667892],
 [10, 14, 0.010971532640425722],
 [10, 15, -0.1238002357798197],
 [10, 16, -0.01738868817319594],
 [10, 17, -0.022773854369880015],
 [10, 18, 0.021002865711157392],
 [10, 19, -0.0014403776359291664],
 [10, 20, -0.07203655050401224],
 [10, 21, -0.038644002709817875],
 [10, 22, -0.08122189129175517],
 [10, 23, -0.03379456242713637],
 [10, 24, -0.008471875907865443],
 [10, 25, -0.09132800233095792],
 [10, 26, -0.050951190838644585],
 [10, 27, -0.03378234754958547],
 [10, 28, 0.05723399306590741],
 [10, 29, -0.10896102171750907],
 [10, 30, -0.08168273418499919],
 [10, 31, 0.09837466509993471],
 [10, 32, -0.031729032949581945],
 [10, 33, -0.034447884164136085],
 [10, 34, -0.028128035308719008],
 [10, 35, -0.02871333654443968],
 [10, 36, -0.02976229542848886],
 [10, 37, -0.08666728529414809],
 [10, 38, 0.7285900297611136],
 [10, 39, -0.04268532519262442],
 [10, 40, -0.023240060060402985],
 [10, 41, -0.027158864337216596],
 [10, 42, -0.02327045058640164],
 [10, 43, -0.033028786141886556],
 [10, 44, -0.02209618443797349],
 [10, 45, -0.03506794168988448],
 [10, 46, -0.07637864985846494],
 [10, 47, -0.02377173332698346],
 [10, 48, -0.0321515172940305],
 [10, 49, 0.11629415975158978],
 [10, 50, -0.055913206192261485],
 [11, 11, 1.0],
 [11, 12, 0.3783334049543345],
 [11, 13, 0.3017347659048834],
 [11, 14, 0.1639578644355698],
 [11, 15, -0.23154047710776085],
 [11, 16, -0.26950809530934755],
 [11, 17, 0.6160000647526084],
 [11, 18, 0.3552786216514341],
 [11, 19, 0.17079948016256846],
 [11, 20, 0.5234227749152832],
 [11, 21, 0.5389688794667039],
 [11, 22, 0.06618081762024598],
 [11, 23, 0.5257696706394296],
 [11, 24, -0.3932175040502084],
 [11, 25, 0.5383708245549939],
 [11, 26, 0.5723505631711016],
 [11, 27, 0.5302096265316935],
 [11, 28, 0.1792218890149233],
 [11, 29, 0.4626547398367485],
 [11, 30, 0.4874051277285779],
 [11, 31, -0.1699302918159169],
 [11, 32, 0.5228507910979407],
 [11, 33, 0.5306468848667669],
 [11, 34, 0.07393661912813314],
 [11, 35, 0.47903382033121594],
 [11, 36, 0.4935207703683176],
 [11, 37, 0.058316081357397735],
 [11, 38, 0.012680634499908212],
 [11, 39, 0.8762309905323089],
 [11, 40, 0.5210057911875188],
 [11, 41, 0.20864472017088218],
 [11, 42, 0.24087422057062557],
 [11, 43, 0.4075037395233391],
 [11, 44, 0.41205481790575454],
 [11, 45, 0.5347210514561082],
 [11, 46, 0.2676649834139057],
 [11, 47, 0.4725312128930939],
 [11, 48, 0.44727044711666486],
 [11, 49, 0.03775337793213841],
 [11, 50, 0.5418493418262286],
 [12, 12, 1.0],
 [12, 13, 0.30716724558930386],
 [12, 14, 0.16051512944250343],
 [12, 15, -0.13699171351566114],
 [12, 16, -0.2617400768501176],
 [12, 17, 0.338953876280052],
 [12, 18, 0.21210183048246967],
 [12, 19, 0.06133691050530572],
 [12, 20, 0.1458778171731179],
 [12, 21, 0.27964941115473396],
 [12, 22, -0.03356340788718315],
 [12, 23, 0.22342853803932916],
 [12, 24, -0.2727152416441266],
 [12, 25, 0.23469780620603492],
 [12, 26, 0.2487684290728988],
 [12, 27, 0.22423818704106885],
 [12, 28, 0.22504108854011765],
 [12, 29, 0.1047689092306219],
 [12, 30, 0.17961218871864232],
 [12, 31, -0.07526148958555601],
 [12, 32, 0.20848815742222235],
 [12, 33, 0.1979729868861458],
 [12, 34, 0.018282315571660875],
 [12, 35, 0.18421352725263251],
 [12, 36, 0.19618133019489967],
 [12, 37, -0.01660931164432867],
 [12, 38, 0.03701121186795992],
 [12, 39, 0.34921610578180184],
 [12, 40, 0.3428027683328482],
 [12, 41, 0.12340974111357562],
 [12, 42, 0.13943641626267855],
 [12, 43, 0.13781703124183464],
 [12, 44, 0.12693022097959974],
 [12, 45, 0.22300595116214736],
 [12, 46, 0.09999973445628996],
 [12, 47, 0.21664945230374763],
 [12, 48, 0.1740402914721433],
 [12, 49, 0.1089919003514185],
 [12, 50, 0.11560642659734578],
 [13, 13, 1.0],
 [13, 14, -0.011078079780546231],
 [13, 15, -0.07898130403626541],
 [13, 16, -0.2619191627141764],
 [13, 17, 0.15602922067523614],
 [13, 18, 0.03641059116263834],
 [13, 19, 0.1984592537339516],
 [13, 20, 0.19500946127743496],
 [13, 21, 0.21263679262549665],
 [13, 22, 0.004619834724377679],
 [13, 23, 0.15695074148930485],
 [13, 24, -0.2323608163038018],
 [13, 25, 0.16710610967981718],
 [13, 26, 0.23970736054386385],
 [13, 27, 0.1569984966090958],
 [13, 28, 0.0405826696358136],
 [13, 29, 0.14733592322663133],
 [13, 30, 0.1710364756347796],
 [13, 31, -0.07795701502686143],
 [13, 32, 0.14361683474986192],
 [13, 33, 0.1363331021806886],
 [13, 34, 0.03301471280744244],
 [13, 35, 0.12346315346990357],
 [13, 36, 0.1329243347894299],
 [13, 37, -0.0760857600093596],
 [13, 38, 0.5434787092513301],
 [13, 39, 0.27486362428357447],
 [13, 40, 0.16159374038911714],
 [13, 41, -0.007900167961005941],
 [13, 42, 0.11064822224558386],
 [13, 43, 0.08722608454956454],
 [13, 44, 0.08254512851411382],
 [13, 45, 0.15022857008874932],
 [13, 46, 0.08597495632245615],
 [13, 47, 0.14038527246325203],
 [13, 48, 0.11401932878843997],
 [13, 49, 0.06805051487121966],
 [13, 50, 0.15886972955610576],
 [14, 14, 1.0],
 [14, 15, -0.6315776315107403],
 [14, 16, -0.18966019562494607],
 [14, 17, 0.7085678341573013],
 [14, 18, 0.9418602362079446],
 [14, 19, -0.48020725965150307],
 [14, 20, -0.04481135060610438],
 [14, 21, 0.14367087500167558],
 [14, 22, -0.19118272146955298],
 [14, 23, 0.1475324876023175],
 [14, 24, -0.2359716160392494],
 [14, 25, 0.0649951361030388],
 [14, 26, -0.011478952919273932],
 [14, 27, 0.1471312149865948],
 [14, 28, 0.540185262423845],
 [14, 29, -0.056358433348869315],
 [14, 30, 0.06116288718117466],
 [14, 31, 0.10701373306766516],
 [14, 32, 0.13598960501551785],
 [14, 33, 0.13574960136878997],
 [14, 34, 0.13704831327737316],
 [14, 35, 0.14665021242918408],
 [14, 36, 0.14219127509701643],
 [14, 37, -0.11627580952216102],
 [14, 38, -0.027742029354697318],
 [14, 39, 0.15190394244021468],
 [14, 40, 0.08255348062857243],
 [14, 41, 0.6449724488703182],
 [14, 42, -0.05887329114529332],
 [14, 43, 0.10468481831696645],
 [14, 44, 0.11417495275763877],
 [14, 45, 0.1469718695238477],
 [14, 46, 0.005254542837067496],
 [14, 47, 0.12896784650036863],
 [14, 48, 0.14060996171984444],
 [14, 49, 0.14394226633816457],
 [14, 50, 0.037106336313562235],
 [15, 15, 1.0],
 [15, 16, 0.14868495420017216],
 [15, 17, -0.5099037371458812],
 [15, 18, -0.6244931568849377],
 [15, 19, 0.585769028148786],
 [15, 20, 0.06638537926580709],
 [15, 21, -0.20081554953774647],
 [15, 22, 0.03187057613163999],
 [15, 23, -0.1972976080800611],
 [15, 24, 0.44558725839729585],
 [15, 25, -0.16501263959779613],
 [15, 26, 0.06317526854273664],
 [15, 27, -0.19607550602804216],
 [15, 28, -0.5084451491831563],
 [15, 29, 0.21094119953618967],
 [15, 30, 0.13043784054705393],
 [15, 31, -0.46014106179509334],
 [15, 32, -0.17733111254373154],
 [15, 33, -0.19007563166441052],
 [15, 34, -0.0805254427141433],
 [15, 35, -0.1794737517903474],
 [15, 36, -0.1749415832702647],
 [15, 37, -0.44634246353210266],
 [15, 38, -0.12023441222150703],
 [15, 39, -0.27315102992245505],
 [15, 40, -0.1250870975465218],
 [15, 41, -0.45377222585694327],
 [15, 42, -0.1297246073340535],
 [15, 43, -0.16272939312248316],
 [15, 44, -0.15595680580345797],
 [15, 45, -0.19151739671080512],
 [15, 46, 0.019051445084640718],
 [15, 47, -0.1708302649152154],
 [15, 48, -0.17645502868466978],
 [15, 49, -0.052933570375630415],
 [15, 50, -0.16183688315737324],
 [16, 16, 1.0],
 [16, 17, -0.28207792519393804],
 [16, 18, -0.21206570000243344],
 [16, 19, -0.1047363589655374],
 [16, 20, -0.3285293684482365],
 [16, 21, -0.177057957710223],
 [16, 22, 0.2950801529918811],
 [16, 23, -0.13815279636426883],
 [16, 24, 0.6155136234112897],
 [16, 25, -0.5498884393052001],
 [16, 26, -0.15185028816032817],
 [16, 27, -0.13464209777035904],
 [16, 28, -0.050129176978553035],
 [16, 29, -0.05690973654946343],
 [16, 30, -0.0837871484482099],
 [16, 31, -0.08306248582031221],
 [16, 32, -0.1238317491826714],
 [16, 33, -0.1307621818679646],
 [16, 34, -0.02233703692758206],
 [16, 35, -0.10314855044038122],
 [16, 36, -0.1082497612430683],
 [16, 37, 0.00045927224437284075],
 [16, 38, -0.0025386394210156664],
 [16, 39, -0.19727223527423482],
 [16, 40, -0.09625344717902005],
 [16, 41, -0.10536417036046439],
 [16, 42, -0.16512155208497414],
 [16, 43, -0.08179189360753873],
 [16, 44, -0.07360318886836688],
 [16, 45, -0.13385787754655137],
 [16, 46, -0.2865656373626429],
 [16, 47, -0.1310391739504281],
 [16, 48, -0.15853108276276234],
 [16, 49, -0.07446962885693008],
 [16, 50, -0.20213228756041576],
 [17, 17, 1.0],
 [17, 18, 0.8371637760826233],
 [17, 19, -0.22537692995029074],
 [17, 20, 0.31950236952244254],
 [17, 21, 0.41443038344073996],
 [17, 22, -0.08952960829708109],
 [17, 23, 0.4168272740605165],
 [17, 24, -0.40952481404375185],
 [17, 25, 0.3996577295713208],
 [17, 26, 0.4042132355845011],
 [17, 27, 0.41683325049883724],
 [17, 28, 0.4801364133760209],
 [17, 29, 0.27197440778209625],
 [17, 30, 0.3662838320872856],
 [17, 31, -0.059946295914309895],
 [17, 32, 0.4061093404152958],
 [17, 33, 0.41136903706966055],
 [17, 34, 0.11445052720904161],
 [17, 35, 0.3898555336954944],
 [17, 36, 0.3940288018965213],
 [17, 37, -0.033777312038734915],
 [17, 38, -0.017227227526071264],
 [17, 39, 0.5586601369292017],
 [17, 40, 0.31057755808454385],
 [17, 41, 0.4982217486230519],
 [17, 42, 0.11751037898748819],
 [17, 43, 0.32378867940778255],
 [17, 44, 0.3251249503660247],
 [17, 45, 0.41817292883600193],
 [17, 46, 0.18569999412371],
 [17, 47, 0.3719576343776961],
 [17, 48, 0.3678989943472801],
 [17, 49, 0.12812504869309474],
 [17, 50, 0.36848517697656047],
 [18, 18, 1.0],
 [18, 19, -0.4237306441865857],
 [18, 20, 0.09342069770392801],
 [18, 21, 0.2542719376139282],
 [18, 22, -0.16129798776480217],
 [18, 23, 0.2617948363035344],
 [18, 24, -0.28467750152928245],
 [18, 25, 0.2025312514278787],
 [18, 26, 0.13214816332555843],
 [18, 27, 0.26193973334637977],
 [18, 28, 0.5445701155920382],
 [18, 29, 0.0524720600637745],
 [18, 30, 0.1632756333558236],
 [18, 31, 0.06784781272349204],
 [18, 32, 0.2511310661026784],
 [18, 33, 0.2545979601115343],
 [18, 34, 0.14189069202909493],
 [18, 35, 0.2509322692032603],
 [18, 36, 0.24973015094967127],
 [18, 37, -0.08601564150907395],
 [18, 38, -0.010332351576980656],
 [18, 39, 0.32248164688590625],
 [18, 40, 0.1803656420183604],
 [18, 41, 0.6654424647334002],
 [18, 42, 0.008512563311155755],
 [18, 43, 0.19729671413287656],
 [18, 44, 0.2052501701316347],
 [18, 45, 0.26270573337701175],
 [18, 46, 0.06957047737679373],
 [18, 47, 0.2296103821857056],
 [18, 48, 0.234293080403833],
 [18, 49, 0.14244124760936283],
 [18, 50, 0.1792565880076421],
 [19, 19, 1.0],
 [19, 20, 0.6129425500363792],
 [19, 21, 0.12358343713463289],
 [19, 22, -0.0669825514093456],
 [19, 23, 0.07651038119436852],
 [19, 24, 0.11865653569264453],
 [19, 25, 0.28569587657913803],
 [19, 26, 0.45834137179206175],
 [19, 27, 0.07409528744675287],
 [19, 28, -0.3632063518717255],
 [19, 29, 0.6390790258445888],
 [19, 30, 0.5662144333080382],
 [19, 31, -0.6377353966506484],
 [19, 32, 0.07937279785986937],
 [19, 33, 0.07202379497597444],
 [19, 34, -0.024596839893700678],
 [19, 35, 0.052775568289609456],
 [19, 36, 0.0635680777159892],
 [19, 37, -0.12952938532050498],
 [19, 38, -0.0073186400336111524],
 [19, 39, 0.1194933478226985],
 [19, 40, 0.06551693584215883],
 [19, 41, -0.29392274211600145],
 [19, 42, 0.1054566674359397],
 [19, 43, 0.04053845067340538],
 [19, 44, 0.025624077107972893],
 [19, 45, 0.07835607984680999],
 [19, 46, 0.2586340384588791],
 [19, 47, 0.05364110795425434],
 [19, 48, 0.09477269697451782],
 [19, 49, 0.01608632712902782],
 [19, 50, 0.10073986110023646],
 [20, 20, 1.0],
 [20, 21, 0.3338062540951563],
 [20, 22, -0.07684147663958968],
 [20, 23, 0.299449698867533],
 [20, 24, -0.2807718815706632],
 [20, 25, 0.6328180572684343],
 [20, 26, 0.7513613292147527],
 [20, 27, 0.29661884242185727],
 [20, 28, -0.07703368025814546],
 [20, 29, 0.7931744143382266],
 [20, 30, 0.7007744533054223],
 [20, 31, -0.4271390396611774],
 [20, 32, 0.30295024245640384],
 [20, 33, 0.30458021368184895],
 [20, 34, 0.06631845385484555],
 [20, 35, 0.2611809061710287],
 [20, 36, 0.27461872598920395],
 [20, 37, 0.019079167005426296],
 [20, 38, -0.01770616727499213],
 [20, 39, 0.42773283779785004],
 [20, 40, 0.1986698853045179],
 [20, 41, 0.0286341674091741],
 [20, 42, 0.2710696426952441],
 [20, 43, 0.21165542263218287],
 [20, 44, 0.19529309994275837],
 [20, 45, 0.3044374090811401],
 [20, 46, 0.40707767225603364],
 [20, 47, 0.23950748101137434],
 [20, 48, 0.3200439083597018],
 [20, 49, 0.009686485182249552],
 [20, 50, 0.3960508758998515],
 [21, 21, 1.0],
 [21, 22, 0.09788112392119964],
 [21, 23, 0.9507621791274329],
 [21, 24, -0.30896503148944576],
 [21, 25, 0.4460768461812894],
 [21, 26, 0.3308621399168185],
 [21, 27, 0.945932693188223],
 [21, 28, 0.17125976458047001],
 [21, 29, 0.2842787967342996],
 [21, 30, 0.2974344284737957],
 [21, 31, -0.108830379648159],
 [21, 32, 0.9105397078260902],
 [21, 33, 0.9095326279075111],
 [21, 34, 0.06603048002625767],
 [21, 35, 0.8913905434444581],
 [21, 36, 0.8991571125108535],
 [21, 37, 0.1310992964405191],
 [21, 38, 0.04160518083488523],
 [21, 39, 0.6222580255685394],
 [21, 40, 0.504852411993617],
 [21, 41, 0.2478343720226353],
 [21, 42, 0.250570743369736],
 [21, 43, 0.777831359925971],
 [21, 44, 0.7686900037482121],
 [21, 45, 0.936139854526885],
 [21, 46, 0.18083806229968816],
 [21, 47, 0.8271401677886263],
 [21, 48, 0.7592811577777758],
 [21, 49, 0.15866260498666768],
 [21, 50, 0.31091192590409217],
 [22, 22, 1.0],
 [22, 23, 0.08613166812551289],
 [22, 24, 0.30953535441113456],
 [22, 25, -0.21615969553944236],
 [22, 26, 0.1516686140143378],
 [22, 27, 0.08624765734080816],
 [22, 28, 0.16032675368272295],
 [22, 29, 0.07434632376782079],
 [22, 30, 0.1603892736706651],
 [22, 31, -0.06430976056570091],
 [22, 32, 0.07070070098116067],
 [22, 33, 0.0663986274294746],
 [22, 34, 0.03971728108684487],
 [22, 35, 0.0825421357944516],
 [22, 36, 0.0810299289968675],
 [22, 37, 0.09016584196660654],
 [22, 38, -0.015076150354891063],
 [22, 39, 0.12397115189989347],
 [22, 40, 0.06390372124948634],
 [22, 41, -0.023828344403536265],
 [22, 42, 0.07972596112737482],
 [22, 43, 0.05895369506616996],
 [22, 44, 0.05808342169048526],
 [22, 45, 0.0739890433913037],
 [22, 46, -0.2207648047029353],
 [22, 47, 0.05649291674598896],
 [22, 48, 0.07042744634097653],
 [22, 49, -0.09230623374485868],
 [22, 50, 0.09058621311503823],
 [23, 23, 1.0],
 [23, 24, -0.29109622181671563],
 [23, 25, 0.42044608049088256],
 [23, 26, 0.3106135245136933],
 [23, 27, 0.9989237065888624],
 [23, 28, 0.1568023168550122],
 [23, 29, 0.24939225790379302],
 [23, 30, 0.24862624562356708],
 [23, 31, -0.07195612358210615],
 [23, 32, 0.9850127625371699],
 [23, 33, 0.9823507294295817],
 [23, 34, 0.06149802696219384],
 [23, 35, 0.9810650035350313],
 [23, 36, 0.9826521657061277],
 [23, 37, 0.11280870792858448],
 [23, 38, 0.03591020607102941],
 [23, 39, 0.5991221224828991],
 [23, 40, 0.49329358789372285],
 [23, 41, 0.23606826639586456],
 [23, 42, 0.21015645874712788],
 [23, 43, 0.8760291075476713],
 [23, 44, 0.8854551251249819],
 [23, 45, 0.9907186701763784],
 [23, 46, 0.15184698620466044],
 [23, 47, 0.8430454463294965],
 [23, 48, 0.7856506663544306],
 [23, 49, 0.1394659445179297],
 [23, 50, 0.3305973738651499],
 [24, 24, 1.0],
 [24, 25, -0.7160256753386346],
 [24, 26, -0.20386332854666753],
 [24, 27, -0.2892051230426301],
 [24, 28, -0.09907580296231677],
 [24, 29, -0.003904125005621972],
 [24, 30, 0.044961544157475046],
 [24, 31, -0.3261496505470107],
 [24, 32, -0.2775284721668159],
 [24, 33, -0.29103947939198344],
 [24, 34, -0.0038157782011779963],
 [24, 35, -0.2477050241721006],
 [24, 36, -0.2550088658167147],
 [24, 37, -0.22428648859398653],
 [24, 38, -0.04299995080048691],
 [24, 39, -0.3691012818388219],
 [24, 40, -0.17458000026581058],
 [24, 41, -0.19182676688428837],
 [24, 42, -0.2735849223985276],
 [24, 43, -0.21782278805807725],
 [24, 44, -0.20407589154372185],
 [24, 45, -0.28752064807381605],
 [24, 46, -0.3426098646699581],
 [24, 47, -0.2696306195376309],
 [24, 48, -0.24442829427085028],
 [24, 49, -0.07485071912821596],
 [24, 50, -0.40167482048788594],
 [25, 25, 1.0],
 [25, 26, 0.489753337832382],
 [25, 27, 0.41599475188212554],
 [25, 28, 0.003965025688557421],
 [25, 29, 0.3960703378974089],
 [25, 30, 0.3217435082265672],
 [25, 31, -0.03799579881264643],
 [25, 32, 0.40752897841607516],
 [25, 33, 0.4273799805914083],
 [25, 34, -0.009633919538594918],
 [25, 35, 0.35692240407428866],
 [25, 36, 0.3713384679424036],
 [25, 37, 0.15913247305421713],
 [25, 38, -0.011827732243043142],
 [25, 39, 0.49169194061107846],
 [25, 40, 0.24341691587777886],
 [25, 41, 0.1749477052210579],
 [25, 42, 0.36578594724634433],
 [25, 43, 0.3204156875395774],
 [25, 44, 0.29332170733735985],
 [25, 45, 0.4162655563052393],
 [25, 46, 0.48764216730171217],
 [25, 47, 0.37357660181021174],
 [25, 48, 0.37589886433027264],
 [25, 49, 0.04038785167197192],
 [25, 50, 0.5740379072067514],
 [26, 26, 1.0],
 [26, 27, 0.3107011746505425],
 [26, 28, 0.03000189806237044],
 [26, 29, 0.7522312289440323],
 [26, 30, 0.7160119849768577],
 [26, 31, -0.43743192497143873],
 [26, 32, 0.32614628516384475],
 [26, 33, 0.3073991951843284],
 [26, 34, 0.06605522755397439],
 [26, 35, 0.29060929387425083],
 [26, 36, 0.3076899868132556],
 [26, 37, -0.047548232176133645],
 [26, 38, -0.02648172809363908],
 [26, 39, 0.48899898430034],
 [26, 40, 0.29037537584848483],
 [26, 41, 0.06323205535216911],
 [26, 42, 0.2746977688980613],
 [26, 43, 0.20467496393809367],
 [26, 44, 0.21127721863779356],
 [26, 45, 0.32024828669541994],
 [26, 46, 0.33635361495697785],
 [26, 47, 0.27661132259779514],
 [26, 48, 0.24071268733455592],
 [26, 49, 0.044011814642673494],
 [26, 50, 0.4082155098708145],
 [27, 27, 1.0],
 [27, 28, 0.15779333684599572],
 [27, 29, 0.24877445963065706],
 [27, 30, 0.25033111646116163],
 [27, 31, -0.07365477536067469],
 [27, 32, 0.9895580881514879],
 [27, 33, 0.9846192382632499],
 [27, 34, 0.06018108438560469],
 [27, 35, 0.9849843580343942],
 [27, 36, 0.9874372543660548],
 [27, 37, 0.10841638895559867],
 [27, 38, 0.035678767289048216],
 [27, 39, 0.6006113192907874],
 [27, 40, 0.49531635413152447],
 [27, 41, 0.2325926942771227],
 [27, 42, 0.2060405002325923],
 [27, 43, 0.8725604753000262],
 [27, 44, 0.8849181406188069],
 [27, 45, 0.9928343379821153],
 [27, 46, 0.147635548689584],
 [27, 47, 0.8373196950347193],
 [27, 48, 0.7715914797600405],
 [27, 49, 0.1311308028346383],
 [27, 50, 0.3300048085066886],
 [28, 28, 1.0],
 [28, 29, -0.15267057638976084],
 [28, 30, 0.1716300370108152],
 [28, 31, 0.12665494977768885],
 [28, 32, 0.1355429075705385],
 [28, 33, 0.1299038026296002],
 [28, 34, 0.10805547473770287],
 [28, 35, 0.15065855222249677],
 [28, 36, 0.14707430968763285],
 [28, 37, 0.09890156324038278],
 [28, 38, 0.06428717433182327],
 [28, 39, 0.2146161966104949],
 [28, 40, 0.15933421636596004],
 [28, 41, 0.4674564231393752],
 [28, 42, 0.12076586629730456],
 [28, 43, 0.11725075652878085],
 [28, 44, 0.10895577074454847],
 [28, 45, 0.15378583546868888],
 [28, 46, -0.05514301826081825],
 [28, 47, 0.10948229173357353],
 [28, 48, 0.15237903050313337],
 [28, 49, 0.07706965459742918],
 [28, 50, 0.003552788931792539],
 [29, 29, 1.0],
 [29, 30, 0.876717075718343],
 [29, 31, -0.725807867879065],
 [29, 32, 0.2589557395261532],
 [29, 33, 0.257500719940952],
 [29, 34, 0.08040970141857132],
 [29, 35, 0.22192803425501997],
 [29, 36, 0.23472933699502666],
 [29, 37, -0.1066815327758048],
 [29, 38, -0.052844671598706774],
 [29, 39, 0.3929355577337712],
 [29, 40, 0.17950559641169286],
 [29, 41, -0.03533920097989172],
 [29, 42, 0.17204733329954733],
 [29, 43, 0.17838493764937333],
 [29, 44, 0.16995159601477058],
 [29, 45, 0.25810025250280594],
 [29, 46, 0.3193514863710723],
 [29, 47, 0.21179751573613761],
 [29, 48, 0.25796890587501686],
 [29, 49, 0.012840908789012007],
 [29, 50, 0.35413950729690874],
 [30, 30, 1.0],
 [30, 31, -0.7738624550379918],
 [30, 32, 0.25109211123886493],
 [30, 33, 0.24321482955831825],
 [30, 34, 0.12016218789492333],
 [30, 35, 0.2244939993740949],
 [30, 36, 0.23532524204718627],
 [30, 37, -0.12248620212213752],
 [30, 38, -0.030909354340535922],
 [30, 39, 0.42975130673425577],
 [30, 40, 0.21575484098340247],
 [30, 41, 0.05970310087900304],
 [30, 42, 0.18605678780578444],
 [30, 43, 0.1748430559691148],
 [30, 44, 0.16275658727355521],
 [30, 45, 0.2577127226201272],
 [30, 46, 0.27262514230725104],
 [30, 47, 0.1986648190997448],
 [30, 48, 0.26464901944743846],
 [30, 49, 0.0410463679014739],
 [30, 50, 0.2818517608550071],
 [31, 31, 1.0],
 [31, 32, -0.0813570110705493],
 [31, 33, -0.07140113552370313],
 [31, 34, -0.06704631241675207],
 [31, 35, -0.06563934503151704],
 [31, 36, -0.07306118565806873],
 [31, 37, 0.2969670328742603],
 [31, 38, 0.07379536983084144],
 [31, 39, -0.12798357865628895],
 [31, 40, -0.06995722528957284],
 [31, 41, 0.13819457090574644],
 [31, 42, 0.015508451560459073],
 [31, 43, -0.04599884655353603],
 [31, 44, -0.04349665702220663],
 [31, 45, -0.08113344427803351],
 [31, 46, -0.157247730384828],
 [31, 47, -0.05707673371821541],
 [31, 48, -0.0920866346695443],
 [31, 49, -0.030470226677365497],
 [31, 50, -0.062152907753009065],
 [32, 32, 1.0],
 [32, 33, 0.9886641218552251],
 [32, 34, 0.057103160072218447],
 [32, 35, 0.9899298468992226],
 [32, 36, 0.9946286950236344],
 [32, 37, 0.08731258699602183],
 [32, 38, 0.03278741392506363],
 [32, 39, 0.5812589877894707],
 [32, 40, 0.48561414844985706],
 [32, 41, 0.2071661909383445],
 [32, 42, 0.18519030890626687],
 [32, 43, 0.8574748046964973],
 [32, 44, 0.892396973972157],
 [32, 45, 0.991730197301385],
 [32, 46, 0.1541887160154394],
 [32, 47, 0.8266677382319672],
 [32, 48, 0.751120158057141],
 [32, 49, 0.12510385110758093],
 [32, 50, 0.33483886150952924],
 [33, 33, 1.0],
 [33, 34, 0.05704678468995559],
 [33, 35, 0.9746426848027026],
 [33, 36, 0.9771147820943458],
 [33, 37, 0.104346673893606],
 [33, 38, 0.031723507429153],
 [33, 39, 0.5884163618475722],
 [33, 40, 0.48451486748385447],
 [33, 41, 0.2084442960710506],
 [33, 42, 0.1836584390238961],
 [33, 43, 0.8817982777492459],
 [33, 44, 0.9160655383059845],
 [33, 45, 0.9872135385448317],
 [33, 46, 0.15342025673630566],
 [33, 47, 0.8310577960861212],
 [33, 48, 0.7944731999343787],
 [33, 49, 0.11104690355988302],
 [33, 50, 0.3715659552885488],
 [34, 34, 1.0],
 [34, 35, 0.05595292382406842],
 [34, 36, 0.055598524607035384],
 [34, 37, 0.02492560301886984],
 [34, 38, 0.045013351494411796],
 [34, 39, 0.06731694332149561],
 [34, 40, 0.03966120380377817],
 [34, 41, 0.0459901988028318],
 [34, 42, -0.014255527580261497],
 [34, 43, 0.05270188669819559],
 [34, 44, 0.04389178848051014],
 [34, 45, 0.060431191507527154],
 [34, 46, 0.021637124074312303],
 [34, 47, 0.04841128984644117],
 [34, 48, 0.08010644036830104],
 [34, 49, 0.02889213221726756],
 [34, 50, 0.019102478847240846],
 [35, 35, 1.0],
 [35, 36, 0.9981642035943722],
 [35, 37, 0.08430846347268746],
 [35, 38, 0.030546776921825086],
 [35, 39, 0.547432079989412],
 [35, 40, 0.45900733688495504],
 [35, 41, 0.2200421646511668],
 [35, 42, 0.1682799853439645],
 [35, 43, 0.8664020038927324],
 [35, 44, 0.8987212136413203],
 [35, 45, 0.9804073472163298],
 [35, 46, 0.12346008262342174],
 [35, 47, 0.8164586601217035],
 [35, 48, 0.7376167918283737],
 [35, 49, 0.11043534324819804],
 [35, 50, 0.2960927853588263],
 [36, 36, 1.0],
 [36, 37, 0.08209998884840194],
 [36, 38, 0.03209891527453585],
 [36, 39, 0.5587397448902097],
 [36, 40, 0.4723595569807236],
 [36, 41, 0.21624139735690162],
 [36, 42, 0.17809772395992027],
 [36, 43, 0.8571503586254158],
 [36, 44, 0.8897425879713218],
 [36, 45, 0.9851096360544593],
 [36, 46, 0.13444788938887534],
 [36, 47, 0.8177442592320627],
 [36, 48, 0.7256862407180842],
 [36, 49, 0.11263049919907263],
 [36, 50, 0.3018848060300704],
 [37, 37, 1.0],
 [37, 38, -0.02042427788604122],
 [37, 39, 0.15039056602328713],
 [37, 40, 0.03770062434686745],
 [37, 41, -0.014364318271367043],
 [37, 42, 0.23500927412986364],
 [37, 43, 0.11391962444435594],
 [37, 44, 0.08091527872995204],
 [37, 45, 0.09810040224854363],
 [37, 46, 0.005794580002472068],
 [37, 47, 0.07755421033071354],
 [37, 48, 0.09730785245812786],
 [37, 49, -0.05158777285133454],
 [37, 50, 0.13194345979193606],
 [38, 38, 1.0],
 [38, 39, 0.02681704667194242],
 [38, 40, 0.016323313149482432],
 [38, 41, 0.007034728150522872],
 [38, 42, 0.04633599110733139],
 [38, 43, 0.026928357224091655],
 [38, 44, 0.024176719422437105],
 [38, 45, 0.03218221259775789],
 [38, 46, -0.023361274728056453],
 [38, 47, 0.02713723095824548],
 [38, 48, 0.030623564105993987],
 [38, 49, 0.029167223069690284],
 [38, 50, 0.00037672963656054404],
 [39, 39, 1.0],
 [39, 40, 0.5191470301531231],
 [39, 41, 0.24340359713342974],
 [39, 42, 0.25991918673767744],
 [39, 43, 0.47827541416210556],
 [39, 44, 0.47760409630001605],
 [39, 45, 0.6007417534403408],
 [39, 46, 0.2619242758247496],
 [39, 47, 0.5243951497656328],
 [39, 48, 0.5023215973373717],
 [39, 49, 0.05320642879590269],
 [39, 50, 0.5312386224232294],
 [40, 40, 1.0],
 [40, 41, 0.12215257855972159],
 [40, 42, 0.11676374057007406],
 [40, 43, 0.39423833145793546],
 [40, 44, 0.3916019154869638],
 [40, 45, 0.5002153626900061],
 [40, 46, 0.06908282681244418],
 [40, 47, 0.4891251948238051],
 [40, 48, 0.3697708581575798],
 [40, 49, 0.0779388612659218],
 [40, 50, 0.2370136386663681],
 [41, 41, 1.0],
 [41, 42, 0.11950493776622104],
 [41, 43, 0.17049775270944567],
 [41, 44, 0.16445104763022136],
 [41, 45, 0.22747533977275566],
 [41, 46, 0.056932943138786975],
 [41, 47, 0.180127735929804],
 [41, 48, 0.22623640850702162],
 [41, 49, 0.08570661015389643],
 [41, 50, 0.10150064503107566],
 [42, 42, 1.0],
 [42, 43, 0.16080048367195468],
 [42, 44, 0.11720469287125934],
 [42, 45, 0.19660182828571784],
 [42, 46, 0.2555380742192417],
 [42, 47, 0.15382687691553745],
 [42, 48, 0.1761664185742136],
 [42, 49, 0.01936839694562563],
 [42, 50, 0.18153611303420533],
 [43, 43, 1.0],
 [43, 44, 0.9367746891349408],
 [43, 45, 0.8620190951671236],
 [43, 46, 0.10637950351348108],
 [43, 47, 0.6552920839734486],
 [43, 48, 0.8067450406119815],
 [43, 49, 0.07221880816790538],
 [43, 50, 0.2511497457671675],
 [44, 44, 1.0],
 [44, 45, 0.8895630093529846],
 [44, 46, 0.09258977896762598],
 [44, 47, 0.6932194425747329],
 [44, 48, 0.8135051151431137],
 [44, 49, 0.08064143931944437],
 [44, 50, 0.26035938113134055],
 [45, 45, 1.0],
 [45, 46, 0.1800243863116213],
 [45, 47, 0.8391982944503477],
 [45, 48, 0.7762407301262705],
 [45, 49, 0.1291823805207253],
 [45, 50, 0.31971185437052735],
 [46, 46, 1.0],
 [46, 47, 0.12953813250163965],
 [46, 48, 0.15214844664277669],
 [46, 49, 0.03653790862488114],
 [46, 50, 0.2375961963661683],
 [47, 47, 1.0],
 [47, 48, 0.6575588340075456],
 [47, 49, 0.1306952207483015],
 [47, 50, 0.3157040324675521],
 [48, 48, 1.0],
 [48, 49, 0.20293498484128464],
 [48, 50, 0.2794589596230296],
 [49, 49, 1.0],
 [49, 50, -0.06493205300100788],
 [50, 50, 1.0]
      ],
      dataLabels: {
        style: {
          textOutline: 0
        },
        enabled: false,
        color: "#000000",
        formatter: function() {
          return "<b>" + getPointCategoryName(this.point, "y") + "</b>";
        }
      }
    }
  ],

  navigation: {
    buttonOptions: {
        enabled: false
    }
  },

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

///////////////////////////////////////////////
// Pruned Features Heatmap
///////////////////////////////////////////////

function getPointCategoryName(point, dimension) {
  var series = point.series,
    isY = dimension === "y",
    axis = series[isY ? "yAxis" : "xAxis"];
  return axis.categories[point[isY ? "y" : "x"]];
}

Highcharts.chart("prunedHeatmap", {
  chart: {
    type: "heatmap",
    marginTop: 60,
    marginBottom: 80,
    plotBorderWidth: 0,
  },

  title: {
    text: "Pruned County Demographic Features",
    x: 0
  },

  xAxis: {
    categories: ['Population, 2014 estimate',
    'Population, 2010 (April 1) estimates base',
    'Population, percent change - April 1, 2010 to July 1, 2014',
    'Population, 2010',
    'Persons under 5 years, percent, 2014',
    'Persons under 18 years, percent, 2014',
    'Persons 65 years and over, percent, 2014',
    'Female persons, percent, 2014',
    'White alone, percent, 2014',
    'Black or African American alone, percent, 2014',
    'American Indian and Alaska Native alone, percent, 2014',
    'Asian alone, percent, 2014',
    'Native Hawaiian and Other Pacific Islander alone, percent, 2014',
    'Two or More Races, percent, 2014',
    'Hispanic or Latino, percent, 2014',
    'White alone, not Hispanic or Latino, percent, 2014',
    'Living in same house 1 year & over, percent, 2009-2013',
    'Foreign born persons, percent, 2009-2013',
    'Language other than English spoken at home, pct age 5+, 2009-2013',
    'High school graduate or higher, percent of persons age 25+, 2009-2013',
    "Bachelor's degree or higher, percent of persons age 25+, 2009-2013",
    'Veterans, 2009-2013',
    'Mean travel time to work (minutes), workers age 16+, 2009-2013',
    'Housing units, 2014',
    'Homeownership rate, 2009-2013',
    'Housing units in multi-unit structures, percent, 2009-2013',
    'Median value of owner-occupied housing units, 2009-2013',
    'Households, 2009-2013',
    'Persons per household, 2009-2013',
    'Per capita money income in past 12 months (2013 dollars), 2009-2013',
    'Median household income, 2009-2013',
    'Persons below poverty level, percent, 2009-2013',
    'Private nonfarm establishments, 2013',
    'Private nonfarm employment,  2013',
    'Private nonfarm employment, percent change, 2012-2013',
    'Nonemployer establishments, 2013',
    'Total number of firms, 2007',
    'Black-owned firms, percent, 2007',
    'American Indian- and Alaska Native-owned firms, percent, 2007',
    'Asian-owned firms, percent, 2007',
    'Native Hawaiian- and Other Pacific Islander-owned firms, percent, 2007',
    'Hispanic-owned firms, percent, 2007',
    'Women-owned firms, percent, 2007',
    'Manufacturers shipments, 2007 ($1,000)',
    'Merchant wholesaler sales, 2007 ($1,000)',
    'Retail sales, 2007 ($1,000)',
    'Retail sales per capita, 2007',
    'Accommodation and food services sales, 2007 ($1,000)',
    'Building permits, 2014',
    'Land area in square miles, 2010',
    'Population per square mile, 2010'],
    labels: {
      enabled: false
    },
    visible: false
  },

  yAxis: {
    categories: ['Population, 2014 estimate',
    'Population, 2010 (April 1) estimates base',
    'Population, percent change - April 1, 2010 to July 1, 2014',
    'Population, 2010',
    'Persons under 5 years, percent, 2014',
    'Persons under 18 years, percent, 2014',
    'Persons 65 years and over, percent, 2014',
    'Female persons, percent, 2014',
    'White alone, percent, 2014',
    'Black or African American alone, percent, 2014',
    'American Indian and Alaska Native alone, percent, 2014',
    'Asian alone, percent, 2014',
    'Native Hawaiian and Other Pacific Islander alone, percent, 2014',
    'Two or More Races, percent, 2014',
    'Hispanic or Latino, percent, 2014',
    'White alone, not Hispanic or Latino, percent, 2014',
    'Living in same house 1 year & over, percent, 2009-2013',
    'Foreign born persons, percent, 2009-2013',
    'Language other than English spoken at home, pct age 5+, 2009-2013',
    'High school graduate or higher, percent of persons age 25+, 2009-2013',
    "Bachelor's degree or higher, percent of persons age 25+, 2009-2013",
    'Veterans, 2009-2013',
    'Mean travel time to work (minutes), workers age 16+, 2009-2013',
    'Housing units, 2014',
    'Homeownership rate, 2009-2013',
    'Housing units in multi-unit structures, percent, 2009-2013',
    'Median value of owner-occupied housing units, 2009-2013',
    'Households, 2009-2013',
    'Persons per household, 2009-2013',
    'Per capita money income in past 12 months (2013 dollars), 2009-2013',
    'Median household income, 2009-2013',
    'Persons below poverty level, percent, 2009-2013',
    'Private nonfarm establishments, 2013',
    'Private nonfarm employment,  2013',
    'Private nonfarm employment, percent change, 2012-2013',
    'Nonemployer establishments, 2013',
    'Total number of firms, 2007',
    'Black-owned firms, percent, 2007',
    'American Indian- and Alaska Native-owned firms, percent, 2007',
    'Asian-owned firms, percent, 2007',
    'Native Hawaiian- and Other Pacific Islander-owned firms, percent, 2007',
    'Hispanic-owned firms, percent, 2007',
    'Women-owned firms, percent, 2007',
    'Manufacturers shipments, 2007 ($1,000)',
    'Merchant wholesaler sales, 2007 ($1,000)',
    'Retail sales, 2007 ($1,000)',
    'Retail sales per capita, 2007',
    'Accommodation and food services sales, 2007 ($1,000)',
    'Building permits, 2014',
    'Land area in square miles, 2010',
    'Population per square mile, 2010'],
    title: null,
    reversed: true,
    labels: {
      enabled: false
    },
    visible: false
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
      [0, "#560d0d"],
      [0.5, "#fbffd9"],
      [1, "#76a21e"]
    ],
    max: 0.55,
    min: -0.56,
    reversed: false
  },

  legend: {
    // align: "right",
    // layout: "vertical",
    // margin: 0,
    verticalAlign: "top",
    // y: 25,
    // symbolHeight: 280
    backgroundColor: 'rgba(255,0,0,0)'
  },

  tooltip: {
    followPointer: true,
    formatter: function() {
      return "<b>" + Highcharts.numberFormat(this.point.value, 2) + '<br>' + getPointCategoryName(this.point, 'x') + '<br>' + getPointCategoryName(this.point, 'y') + "</b>";
    }
  },

//   tooltip: {
//     formatter: function () {
//         return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
//             this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
//     }
// },

  series: [
    {
      borderWidth: 0,
      data: [
        [0, 0, 1.0],
 [0, 1, 0.31661268534509585],
 [0, 2, 0.30284194122400776],
 [0, 3, -0.5128848555379655],
 [0, 4, 0.0534371561574885],
 [0, 5, 0.09155922389020839],
 [0, 6, -0.1656084419012714],
 [0, 7, -0.018694294412465392],
 [0, 8, 0.3676433764672444],
 [0, 9, 0.22429018150876776],
 [0, 10, 0.17780198585956042],
 [0, 11, 0.22533273553569352],
 [0, 12, -0.09195012506456696],
 [0, 13, -0.31040713238261963],
 [0, 14, 0.3828397287407309],
 [0, 15, 0.29162929033928553],
 [0, 16, 0.21742241237961885],
 [0, 17, 0.5021306562738775],
 [0, 18, 0.11130220578035199],
 [0, 19, -0.20212820232169273],
 [0, 20, 0.37249818425038406],
 [0, 21, 0.41475776695106426],
 [0, 22, 0.34784122713716353],
 [0, 23, 0.4349222302091862],
 [0, 24, 0.5486969155662212],
 [0, 25, -0.3041549164594311],
 [0, 26, 0.196273580739032],
 [0, 27, 0.2234801026745834],
 [0, 28, 0.2540548473478041],
 [0, 29, 0.2525286581667441],
 [0, 30, 0.1565090770106964],
 [0, 31, 0.25148286014485377],
 [0, 32, 0.3134426358769995],
 [0, 33, 0.19890262236471584],
 [0, 34, 0.35286528348879886],
 [0, 35, 0.055041572655377506],
 [0, 36, 0.24364461315527183],
 [1, 1, 1.0],
 [1, 2, 0.8718613430831322],
 [1, 3, -0.6172572261206584],
 [1, 4, 0.13427216291789132],
 [1, 5, -0.12956527754966884],
 [1, 6, 0.07769460383209006],
 [1, 7, 0.1022400604101808],
 [1, 8, 0.12075973745560098],
 [1, 9, 0.21735987708016272],
 [1, 10, 0.08604918366082037],
 [1, 11, 0.4463806312061944],
 [1, 12, -0.43345004341684157],
 [1, 13, -0.19626175070016053],
 [1, 14, 0.3741347362887202],
 [1, 15, 0.4499691690091679],
 [1, 16, -0.25858700635399084],
 [1, 17, -0.07293244618427289],
 [1, 18, -0.20740782754457593],
 [1, 19, -0.32476422855760123],
 [1, 20, 0.17122662422443588],
 [1, 21, -0.12421764086617737],
 [1, 22, 0.5968143218317787],
 [1, 23, -0.12446885125246356],
 [1, 24, 0.06334664924952196],
 [1, 25, 0.13199624293364243],
 [1, 26, 0.05739896309951288],
 [1, 27, 0.09492773717077035],
 [1, 28, 0.3253998827535218],
 [1, 29, 0.11121110602372523],
 [1, 30, 0.08424589671467167],
 [1, 31, 0.11589434787134113],
 [1, 32, 0.16031629433818756],
 [1, 33, 0.07776125315839034],
 [1, 34, 0.1436449930061432],
 [1, 35, 0.08878279916895696],
 [1, 36, 0.07495516480894931],
 [2, 2, 1.0],
 [2, 3, -0.5798574055915346],
 [2, 4, 0.16738320305694818],
 [2, 5, -0.025101213948268867],
 [2, 6, -0.008847815886418487],
 [2, 7, 0.09824605388059753],
 [2, 8, 0.038439093191863186],
 [2, 9, 0.1698492324583732],
 [2, 10, 0.03275440777904842],
 [2, 11, 0.40772739464799845],
 [2, 12, -0.3243019553058903],
 [2, 13, -0.00036429925974183774],
 [2, 14, 0.3057400838110682],
 [2, 15, 0.39461629452758457],
 [2, 16, -0.21562669453861236],
 [2, 17, -0.12841786114134612],
 [2, 18, -0.0876717183825381],
 [2, 19, -0.08488712855522455],
 [2, 20, -0.01998666389720336],
 [2, 21, -0.15399236352408593],
 [2, 22, 0.6916186091390214],
 [2, 23, -0.11175694349053644],
 [2, 24, 0.14211213279899623],
 [2, 25, 0.01593437556410599],
 [2, 26, 0.07221040116332887],
 [2, 27, 0.059266043194127996],
 [2, 28, 0.2984345141152509],
 [2, 29, 0.06932304359992866],
 [2, 30, 0.05277546233495204],
 [2, 31, 0.07187739092119991],
 [2, 32, 0.03552871084446892],
 [2, 33, 0.03141729368776138],
 [2, 34, 0.11061859122004272],
 [2, 35, 0.07874247910401161],
 [2, 36, -0.06368524926732155],
 [3, 3, 1.0],
 [3, 4, 0.09554003895607784],
 [3, 5, 0.2561962366800521],
 [3, 6, -0.19011153903989575],
 [3, 7, -0.003736874419822793],
 [3, 8, -0.3344676587748005],
 [3, 9, -0.2362360797611918],
 [3, 10, -0.13917225968131955],
 [3, 11, -0.295833537369241],
 [3, 12, 0.4185908435127034],
 [3, 13, 0.43144878223025523],
 [3, 14, -0.42139438827878267],
 [3, 15, -0.3525338138067991],
 [3, 16, 0.08164143234301],
 [3, 17, -0.2657282384214304],
 [3, 18, -0.005964894033270497],
 [3, 19, 0.46922884628458705],
 [3, 20, -0.4768373148332644],
 [3, 21, -0.17862878817252345],
 [3, 22, -0.6060458506568911],
 [3, 23, -0.08291851087698876],
 [3, 24, -0.3275561283669618],
 [3, 25, -0.0381757733301316],
 [3, 26, -0.10308829109297975],
 [3, 27, -0.21242141271534376],
 [3, 28, -0.2876676896550489],
 [3, 29, -0.29982504156491374],
 [3, 30, -0.16357552776988046],
 [3, 31, -0.2424042017205775],
 [3, 32, -0.21319246034687292],
 [3, 33, -0.18455948572522432],
 [3, 34, -0.26875516199899396],
 [3, 35, -0.05504789046654801],
 [3, 36, -0.2342843907846514],
 [4, 4, 1.0],
 [4, 5, -0.16076507636295942],
 [4, 6, 0.17044672090931043],
 [4, 7, -0.05961649743748754],
 [4, 8, 0.042282874903576136],
 [4, 9, -0.03598176899488093],
 [4, 10, 0.002870122694395915],
 [4, 11, -0.22601322710209398],
 [4, 12, 0.041914394241438106],
 [4, 13, 0.176032739649878],
 [4, 14, -0.1247508212794902],
 [4, 15, -0.17576164776303888],
 [4, 16, 0.1204455408565227],
 [4, 17, 0.15375995920451102],
 [4, 18, 0.05846670433521204],
 [4, 19, -0.07525320312213847],
 [4, 20, 0.138315638885728],
 [4, 21, 0.04117268756250624],
 [4, 22, -0.07211802349667747],
 [4, 23, 0.11059767761091219],
 [4, 24, -0.028132319729790026],
 [4, 25, 0.06279499447373985],
 [4, 26, -0.052612986419727024],
 [4, 27, 0.06769851091020042],
 [4, 28, -0.048390014685254126],
 [4, 29, 0.2060049885949224],
 [4, 30, 0.04530444448763897],
 [4, 31, 0.07851417714730462],
 [4, 32, 0.187336386927593],
 [4, 33, 0.050649634514473484],
 [4, 34, 0.0580267902745031],
 [4, 35, -0.11184031945190286],
 [4, 36, 0.09959266186822811],
 [5, 5, 1.0],
 [5, 6, -0.9386186676781639],
 [5, 7, -0.16165767675835951],
 [5, 8, -0.1528810333141831],
 [5, 9, -0.03847336168789365],
 [5, 10, -0.13418147698499286],
 [5, 11, 0.148540086249858],
 [5, 12, 0.6720749702870471],
 [5, 13, 0.019231282434575715],
 [5, 14, 0.014840601966622633],
 [5, 15, 0.10137944714232944],
 [5, 16, 0.27895651739214106],
 [5, 17, 0.032973990506698456],
 [5, 18, -0.14070388301347964],
 [5, 19, 0.3544428652091693],
 [5, 20, -0.15803995600545662],
 [5, 21, 0.05534572111135521],
 [5, 22, -0.13373103425314037],
 [5, 23, 0.206464831890134],
 [5, 24, 0.2150597265864424],
 [5, 25, -0.4772613008333946],
 [5, 26, 0.028686398470329562],
 [5, 27, -0.09372223955538811],
 [5, 28, 0.04424451269995721],
 [5, 29, -0.22609880181338227],
 [5, 30, -0.09407075398825945],
 [5, 31, -0.11104831836256418],
 [5, 32, 0.02518387315020872],
 [5, 33, -0.10171547535504293],
 [5, 34, -0.09556005406178746],
 [5, 35, 0.06412060614623065],
 [5, 36, -0.17944577924885113],
 [6, 6, 1.0],
 [6, 7, -0.12481108400092175],
 [6, 8, -0.028237016710071314],
 [6, 9, -0.07118183677647127],
 [6, 10, -0.16102844686550818],
 [6, 11, -0.18094363710233002],
 [6, 12, -0.605782552204106],
 [6, 13, 0.0530797269784721],
 [6, 14, -0.12723242755993028],
 [6, 15, -0.17144493153201223],
 [6, 16, -0.3273588691230095],
 [6, 17, -0.11968986815531797],
 [6, 18, 0.15120577823445597],
 [6, 19, -0.2709361639177719],
 [6, 20, 0.0774431815531472],
 [6, 21, -0.16017319124066615],
 [6, 22, 0.08670256784788426],
 [6, 23, -0.27235278032866606],
 [6, 24, -0.29441276077461764],
 [6, 25, 0.4954042576970977],
 [6, 26, -0.03741451185276867],
 [6, 27, 0.008033230338368181],
 [6, 28, -0.07331097567515293],
 [6, 29, 0.18466403061982434],
 [6, 30, 0.024788757159356998],
 [6, 31, 0.01837171954324143],
 [6, 32, -0.059228449213191876],
 [6, 33, 0.017298228044126063],
 [6, 34, 0.019669569059568667],
 [6, 35, -0.10582349680760092],
 [6, 36, 0.09209045095769433],
 [7, 7, 1.0],
 [7, 8, -0.04067798622611659],
 [7, 9, 0.04933023066192576],
 [7, 10, 0.6798198283667892],
 [7, 11, 0.010971532640425722],
 [7, 12, -0.1238002357798197],
 [7, 13, -0.01738868817319594],
 [7, 14, -0.022773854369880015],
 [7, 15, 0.021002865711157392],
 [7, 16, -0.0014403776359291664],
 [7, 17, -0.07203655050401224],
 [7, 18, -0.08122189129175517],
 [7, 19, -0.008471875907865443],
 [7, 20, -0.09132800233095792],
 [7, 21, -0.050951190838644585],
 [7, 22, 0.05723399306590741],
 [7, 23, -0.10896102171750907],
 [7, 24, -0.08168273418499919],
 [7, 25, 0.09837466509993471],
 [7, 26, -0.028128035308719008],
 [7, 27, -0.02976229542848886],
 [7, 28, -0.027158864337216596],
 [7, 29, -0.02327045058640164],
 [7, 30, -0.02209618443797349],
 [7, 31, -0.03506794168988448],
 [7, 32, -0.07637864985846494],
 [7, 33, -0.02377173332698346],
 [7, 34, -0.0321515172940305],
 [7, 35, 0.11629415975158978],
 [7, 36, -0.055913206192261485],
 [8, 8, 1.0],
 [8, 9, 0.3783334049543345],
 [8, 10, 0.3017347659048834],
 [8, 11, 0.1639578644355698],
 [8, 12, -0.23154047710776085],
 [8, 13, -0.26950809530934755],
 [8, 14, 0.6160000647526084],
 [8, 15, 0.3552786216514341],
 [8, 16, 0.17079948016256846],
 [8, 17, 0.5234227749152832],
 [8, 18, 0.06618081762024598],
 [8, 19, -0.3932175040502084],
 [8, 20, 0.5383708245549939],
 [8, 21, 0.5723505631711016],
 [8, 22, 0.1792218890149233],
 [8, 23, 0.4626547398367485],
 [8, 24, 0.4874051277285779],
 [8, 25, -0.1699302918159169],
 [8, 26, 0.07393661912813314],
 [8, 27, 0.4935207703683176],
 [8, 28, 0.20864472017088218],
 [8, 29, 0.24087422057062557],
 [8, 30, 0.41205481790575454],
 [8, 31, 0.5347210514561082],
 [8, 32, 0.2676649834139057],
 [8, 33, 0.4725312128930939],
 [8, 34, 0.44727044711666486],
 [8, 35, 0.03775337793213841],
 [8, 36, 0.5418493418262286],
 [9, 9, 1.0],
 [9, 10, 0.30716724558930386],
 [9, 11, 0.16051512944250343],
 [9, 12, -0.13699171351566114],
 [9, 13, -0.2617400768501176],
 [9, 14, 0.338953876280052],
 [9, 15, 0.21210183048246967],
 [9, 16, 0.06133691050530572],
 [9, 17, 0.1458778171731179],
 [9, 18, -0.03356340788718315],
 [9, 19, -0.2727152416441266],
 [9, 20, 0.23469780620603492],
 [9, 21, 0.2487684290728988],
 [9, 22, 0.22504108854011765],
 [9, 23, 0.1047689092306219],
 [9, 24, 0.17961218871864232],
 [9, 25, -0.07526148958555601],
 [9, 26, 0.018282315571660875],
 [9, 27, 0.19618133019489967],
 [9, 28, 0.12340974111357562],
 [9, 29, 0.13943641626267855],
 [9, 30, 0.12693022097959974],
 [9, 31, 0.22300595116214736],
 [9, 32, 0.09999973445628996],
 [9, 33, 0.21664945230374763],
 [9, 34, 0.1740402914721433],
 [9, 35, 0.1089919003514185],
 [9, 36, 0.11560642659734578],
 [10, 10, 1.0],
 [10, 11, -0.011078079780546231],
 [10, 12, -0.07898130403626541],
 [10, 13, -0.2619191627141764],
 [10, 14, 0.15602922067523614],
 [10, 15, 0.03641059116263834],
 [10, 16, 0.1984592537339516],
 [10, 17, 0.19500946127743496],
 [10, 18, 0.004619834724377679],
 [10, 19, -0.2323608163038018],
 [10, 20, 0.16710610967981718],
 [10, 21, 0.23970736054386385],
 [10, 22, 0.0405826696358136],
 [10, 23, 0.14733592322663133],
 [10, 24, 0.1710364756347796],
 [10, 25, -0.07795701502686143],
 [10, 26, 0.03301471280744244],
 [10, 27, 0.1329243347894299],
 [10, 28, -0.007900167961005941],
 [10, 29, 0.11064822224558386],
 [10, 30, 0.08254512851411382],
 [10, 31, 0.15022857008874932],
 [10, 32, 0.08597495632245615],
 [10, 33, 0.14038527246325203],
 [10, 34, 0.11401932878843997],
 [10, 35, 0.06805051487121966],
 [10, 36, 0.15886972955610576],
 [11, 11, 1.0],
 [11, 12, -0.6315776315107403],
 [11, 13, -0.18966019562494607],
 [11, 14, 0.7085678341573013],
 [11, 15, 0.9418602362079446],
 [11, 16, -0.48020725965150307],
 [11, 17, -0.04481135060610438],
 [11, 18, -0.19118272146955298],
 [11, 19, -0.2359716160392494],
 [11, 20, 0.0649951361030388],
 [11, 21, -0.011478952919273932],
 [11, 22, 0.540185262423845],
 [11, 23, -0.056358433348869315],
 [11, 24, 0.06116288718117466],
 [11, 25, 0.10701373306766516],
 [11, 26, 0.13704831327737316],
 [11, 27, 0.14219127509701643],
 [11, 28, 0.6449724488703182],
 [11, 29, -0.05887329114529332],
 [11, 30, 0.11417495275763877],
 [11, 31, 0.1469718695238477],
 [11, 32, 0.005254542837067496],
 [11, 33, 0.12896784650036863],
 [11, 34, 0.14060996171984444],
 [11, 35, 0.14394226633816457],
 [11, 36, 0.037106336313562235],
 [12, 12, 1.0],
 [12, 13, 0.14868495420017216],
 [12, 14, -0.5099037371458812],
 [12, 15, -0.6244931568849377],
 [12, 16, 0.585769028148786],
 [12, 17, 0.06638537926580709],
 [12, 18, 0.03187057613163999],
 [12, 19, 0.44558725839729585],
 [12, 20, -0.16501263959779613],
 [12, 21, 0.06317526854273664],
 [12, 22, -0.5084451491831563],
 [12, 23, 0.21094119953618967],
 [12, 24, 0.13043784054705393],
 [12, 25, -0.46014106179509334],
 [12, 26, -0.0805254427141433],
 [12, 27, -0.1749415832702647],
 [12, 28, -0.45377222585694327],
 [12, 29, -0.1297246073340535],
 [12, 30, -0.15595680580345797],
 [12, 31, -0.19151739671080512],
 [12, 32, 0.019051445084640718],
 [12, 33, -0.1708302649152154],
 [12, 34, -0.17645502868466978],
 [12, 35, -0.052933570375630415],
 [12, 36, -0.16183688315737324],
 [13, 13, 1.0],
 [13, 14, -0.28207792519393804],
 [13, 15, -0.21206570000243344],
 [13, 16, -0.1047363589655374],
 [13, 17, -0.3285293684482365],
 [13, 18, 0.2950801529918811],
 [13, 19, 0.6155136234112897],
 [13, 20, -0.5498884393052001],
 [13, 21, -0.15185028816032817],
 [13, 22, -0.050129176978553035],
 [13, 23, -0.05690973654946343],
 [13, 24, -0.0837871484482099],
 [13, 25, -0.08306248582031221],
 [13, 26, -0.02233703692758206],
 [13, 27, -0.1082497612430683],
 [13, 28, -0.10536417036046439],
 [13, 29, -0.16512155208497414],
 [13, 30, -0.07360318886836688],
 [13, 31, -0.13385787754655137],
 [13, 32, -0.2865656373626429],
 [13, 33, -0.1310391739504281],
 [13, 34, -0.15853108276276234],
 [13, 35, -0.07446962885693008],
 [13, 36, -0.20213228756041576],
 [14, 14, 1.0],
 [14, 15, 0.8371637760826233],
 [14, 16, -0.22537692995029074],
 [14, 17, 0.31950236952244254],
 [14, 18, -0.08952960829708109],
 [14, 19, -0.40952481404375185],
 [14, 20, 0.3996577295713208],
 [14, 21, 0.4042132355845011],
 [14, 22, 0.4801364133760209],
 [14, 23, 0.27197440778209625],
 [14, 24, 0.3662838320872856],
 [14, 25, -0.059946295914309895],
 [14, 26, 0.11445052720904161],
 [14, 27, 0.3940288018965213],
 [14, 28, 0.4982217486230519],
 [14, 29, 0.11751037898748819],
 [14, 30, 0.3251249503660247],
 [14, 31, 0.41817292883600193],
 [14, 32, 0.18569999412371],
 [14, 33, 0.3719576343776961],
 [14, 34, 0.3678989943472801],
 [14, 35, 0.12812504869309474],
 [14, 36, 0.36848517697656047],
 [15, 15, 1.0],
 [15, 16, -0.4237306441865857],
 [15, 17, 0.09342069770392801],
 [15, 18, -0.16129798776480217],
 [15, 19, -0.28467750152928245],
 [15, 20, 0.2025312514278787],
 [15, 21, 0.13214816332555843],
 [15, 22, 0.5445701155920382],
 [15, 23, 0.0524720600637745],
 [15, 24, 0.1632756333558236],
 [15, 25, 0.06784781272349204],
 [15, 26, 0.14189069202909493],
 [15, 27, 0.24973015094967127],
 [15, 28, 0.6654424647334002],
 [15, 29, 0.008512563311155755],
 [15, 30, 0.2052501701316347],
 [15, 31, 0.26270573337701175],
 [15, 32, 0.06957047737679373],
 [15, 33, 0.2296103821857056],
 [15, 34, 0.234293080403833],
 [15, 35, 0.14244124760936283],
 [15, 36, 0.1792565880076421],
 [16, 16, 1.0],
 [16, 17, 0.6129425500363792],
 [16, 18, -0.0669825514093456],
 [16, 19, 0.11865653569264453],
 [16, 20, 0.28569587657913803],
 [16, 21, 0.45834137179206175],
 [16, 22, -0.3632063518717255],
 [16, 23, 0.6390790258445888],
 [16, 24, 0.5662144333080382],
 [16, 25, -0.6377353966506484],
 [16, 26, -0.024596839893700678],
 [16, 27, 0.0635680777159892],
 [16, 28, -0.29392274211600145],
 [16, 29, 0.1054566674359397],
 [16, 30, 0.025624077107972893],
 [16, 31, 0.07835607984680999],
 [16, 32, 0.2586340384588791],
 [16, 33, 0.05364110795425434],
 [16, 34, 0.09477269697451782],
 [16, 35, 0.01608632712902782],
 [16, 36, 0.10073986110023646],
 [17, 17, 1.0],
 [17, 18, -0.07684147663958968],
 [17, 19, -0.2807718815706632],
 [17, 20, 0.6328180572684343],
 [17, 21, 0.7513613292147527],
 [17, 22, -0.07703368025814546],
 [17, 23, 0.7931744143382266],
 [17, 24, 0.7007744533054223],
 [17, 25, -0.4271390396611774],
 [17, 26, 0.06631845385484555],
 [17, 27, 0.27461872598920395],
 [17, 28, 0.0286341674091741],
 [17, 29, 0.2710696426952441],
 [17, 30, 0.19529309994275837],
 [17, 31, 0.3044374090811401],
 [17, 32, 0.40707767225603364],
 [17, 33, 0.23950748101137434],
 [17, 34, 0.3200439083597018],
 [17, 35, 0.009686485182249552],
 [17, 36, 0.3960508758998515],
 [18, 18, 1.0],
 [18, 19, 0.30953535441113456],
 [18, 20, -0.21615969553944236],
 [18, 21, 0.1516686140143378],
 [18, 22, 0.16032675368272295],
 [18, 23, 0.07434632376782079],
 [18, 24, 0.1603892736706651],
 [18, 25, -0.06430976056570091],
 [18, 26, 0.03971728108684487],
 [18, 27, 0.0810299289968675],
 [18, 28, -0.023828344403536265],
 [18, 29, 0.07972596112737482],
 [18, 30, 0.05808342169048526],
 [18, 31, 0.0739890433913037],
 [18, 32, -0.2207648047029353],
 [18, 33, 0.05649291674598896],
 [18, 34, 0.07042744634097653],
 [18, 35, -0.09230623374485868],
 [18, 36, 0.09058621311503823],
 [19, 19, 1.0],
 [19, 20, -0.7160256753386346],
 [19, 21, -0.20386332854666753],
 [19, 22, -0.09907580296231677],
 [19, 23, -0.003904125005621972],
 [19, 24, 0.044961544157475046],
 [19, 25, -0.3261496505470107],
 [19, 26, -0.0038157782011779963],
 [19, 27, -0.2550088658167147],
 [19, 28, -0.19182676688428837],
 [19, 29, -0.2735849223985276],
 [19, 30, -0.20407589154372185],
 [19, 31, -0.28752064807381605],
 [19, 32, -0.3426098646699581],
 [19, 33, -0.2696306195376309],
 [19, 34, -0.24442829427085028],
 [19, 35, -0.07485071912821596],
 [19, 36, -0.40167482048788594],
 [20, 20, 1.0],
 [20, 21, 0.489753337832382],
 [20, 22, 0.003965025688557421],
 [20, 23, 0.3960703378974089],
 [20, 24, 0.3217435082265672],
 [20, 25, -0.03799579881264643],
 [20, 26, -0.009633919538594918],
 [20, 27, 0.3713384679424036],
 [20, 28, 0.1749477052210579],
 [20, 29, 0.36578594724634433],
 [20, 30, 0.29332170733735985],
 [20, 31, 0.4162655563052393],
 [20, 32, 0.48764216730171217],
 [20, 33, 0.37357660181021174],
 [20, 34, 0.37589886433027264],
 [20, 35, 0.04038785167197192],
 [20, 36, 0.5740379072067514],
 [21, 21, 1.0],
 [21, 22, 0.03000189806237044],
 [21, 23, 0.7522312289440323],
 [21, 24, 0.7160119849768577],
 [21, 25, -0.43743192497143873],
 [21, 26, 0.06605522755397439],
 [21, 27, 0.3076899868132556],
 [21, 28, 0.06323205535216911],
 [21, 29, 0.2746977688980613],
 [21, 30, 0.21127721863779356],
 [21, 31, 0.32024828669541994],
 [21, 32, 0.33635361495697785],
 [21, 33, 0.27661132259779514],
 [21, 34, 0.24071268733455592],
 [21, 35, 0.044011814642673494],
 [21, 36, 0.4082155098708145],
 [22, 22, 1.0],
 [22, 23, -0.15267057638976084],
 [22, 24, 0.1716300370108152],
 [22, 25, 0.12665494977768885],
 [22, 26, 0.10805547473770287],
 [22, 27, 0.14707430968763285],
 [22, 28, 0.4674564231393752],
 [22, 29, 0.12076586629730456],
 [22, 30, 0.10895577074454847],
 [22, 31, 0.15378583546868888],
 [22, 32, -0.05514301826081825],
 [22, 33, 0.10948229173357353],
 [22, 34, 0.15237903050313337],
 [22, 35, 0.07706965459742918],
 [22, 36, 0.003552788931792539],
 [23, 23, 1.0],
 [23, 24, 0.876717075718343],
 [23, 25, -0.725807867879065],
 [23, 26, 0.08040970141857132],
 [23, 27, 0.23472933699502666],
 [23, 28, -0.03533920097989172],
 [23, 29, 0.17204733329954733],
 [23, 30, 0.16995159601477058],
 [23, 31, 0.25810025250280594],
 [23, 32, 0.3193514863710723],
 [23, 33, 0.21179751573613761],
 [23, 34, 0.25796890587501686],
 [23, 35, 0.012840908789012007],
 [23, 36, 0.35413950729690874],
 [24, 24, 1.0],
 [24, 25, -0.7738624550379918],
 [24, 26, 0.12016218789492333],
 [24, 27, 0.23532524204718627],
 [24, 28, 0.05970310087900304],
 [24, 29, 0.18605678780578444],
 [24, 30, 0.16275658727355521],
 [24, 31, 0.2577127226201272],
 [24, 32, 0.27262514230725104],
 [24, 33, 0.1986648190997448],
 [24, 34, 0.26464901944743846],
 [24, 35, 0.0410463679014739],
 [24, 36, 0.2818517608550071],
 [25, 25, 1.0],
 [25, 26, -0.06704631241675207],
 [25, 27, -0.07306118565806873],
 [25, 28, 0.13819457090574644],
 [25, 29, 0.015508451560459073],
 [25, 30, -0.04349665702220663],
 [25, 31, -0.08113344427803351],
 [25, 32, -0.157247730384828],
 [25, 33, -0.05707673371821541],
 [25, 34, -0.0920866346695443],
 [25, 35, -0.030470226677365497],
 [25, 36, -0.062152907753009065],
 [26, 26, 1.0],
 [26, 27, 0.055598524607035384],
 [26, 28, 0.0459901988028318],
 [26, 29, -0.014255527580261497],
 [26, 30, 0.04389178848051014],
 [26, 31, 0.060431191507527154],
 [26, 32, 0.021637124074312303],
 [26, 33, 0.04841128984644117],
 [26, 34, 0.08010644036830104],
 [26, 35, 0.02889213221726756],
 [26, 36, 0.019102478847240846],
 [27, 27, 1.0],
 [27, 28, 0.21624139735690162],
 [27, 29, 0.17809772395992027],
 [27, 30, 0.8897425879713218],
 [27, 31, 0.9851096360544593],
 [27, 32, 0.13444788938887534],
 [27, 33, 0.8177442592320627],
 [27, 34, 0.7256862407180842],
 [27, 35, 0.11263049919907263],
 [27, 36, 0.3018848060300704],
 [28, 28, 1.0],
 [28, 29, 0.11950493776622104],
 [28, 30, 0.16445104763022136],
 [28, 31, 0.22747533977275566],
 [28, 32, 0.056932943138786975],
 [28, 33, 0.180127735929804],
 [28, 34, 0.22623640850702162],
 [28, 35, 0.08570661015389643],
 [28, 36, 0.10150064503107566],
 [29, 29, 1.0],
 [29, 30, 0.11720469287125934],
 [29, 31, 0.19660182828571784],
 [29, 32, 0.2555380742192417],
 [29, 33, 0.15382687691553745],
 [29, 34, 0.1761664185742136],
 [29, 35, 0.01936839694562563],
 [29, 36, 0.18153611303420533],
 [30, 30, 1.0],
 [30, 31, 0.8895630093529846],
 [30, 32, 0.09258977896762598],
 [30, 33, 0.6932194425747329],
 [30, 34, 0.8135051151431137],
 [30, 35, 0.08064143931944437],
 [30, 36, 0.26035938113134055],
 [31, 31, 1.0],
 [31, 32, 0.1800243863116213],
 [31, 33, 0.8391982944503477],
 [31, 34, 0.7762407301262705],
 [31, 35, 0.1291823805207253],
 [31, 36, 0.31971185437052735],
 [32, 32, 1.0],
 [32, 33, 0.12953813250163965],
 [32, 34, 0.15214844664277669],
 [32, 35, 0.03653790862488114],
 [32, 36, 0.2375961963661683],
 [33, 33, 1.0],
 [33, 34, 0.6575588340075456],
 [33, 35, 0.1306952207483015],
 [33, 36, 0.3157040324675521],
 [34, 34, 1.0],
 [34, 35, 0.20293498484128464],
 [34, 36, 0.2794589596230296],
 [35, 35, 1.0],
 [35, 36, -0.06493205300100788],
 [36, 36, 1.0]
      ],
      dataLabels: {
        style: {
          textOutline: 0
        },
        enabled: false,
        color: "#000000",
        formatter: function() {
          return "<b>" + getPointCategoryName(this.point, "y") + "</b>";
        }
      }
    }
  ],

  navigation: {
    buttonOptions: {
        enabled: false
    }
  },

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

///////////////////////////////////////////////
// Feature Importance Chart
///////////////////////////////////////////////

Highcharts.chart("featureImportance", {
  chart: {
    type: "bar"
  },
  title: {
    text: ""
  },
  xAxis: {
    labels: {
      style: {
        fontSize: "10px"
      }
    },
    categories: [
      "Black or African American alone, percent, 2014",
      "Land area in square miles, 2010",
      "Median value of owner-occupied housing units, 2009-2013",
      "High school graduate or higher, percent of persons age 25+, 2009-2013",
      "White alone, percent, 2014",
      "Bachelor's degree or higher, percent of persons age 25+, 2009-2013",
      "Housing units in multi-unit structures, percent, 2009-2013",
      "Hispanic or Latino, percent, 2014",
      "Language other than English spoken at home, pct age 5+, 2009-2013",
      "Foreign born persons, percent, 2009-2013",
      "Homeownership rate, 2009-2013",
      "White alone, not Hispanic or Latino, percent, 2014",
      "Supports eliminating electoral college in favor of popular vote",
      "Female persons, percent, 2014",
      "Persons under 18 years, percent, 2014",
      "Require gun owners to obtain a license for assault weapons",
      "American Indian and Alaska Native alone, percent, 2014",
      "Population per square mile, 2010",
      "Median household income, 2009-2013",
      "Persons per household, 2009-2013",
      "Asian alone, percent, 2014",
      "Children attended K-12 public schools",
      "Mean travel time to work (minutes), workers age 16+, 2009-2013",
      "Net worth",
      "Per capita money income in past 12 months (2013 dollars), 2009-2013",
      "Living in same house 1 year & over, percent, 2009-2013",
      "Outside donation money",
      "Government subsidizes public four-year colleges",
      "Accommodation and food services sales, 2007 ($1,000)",
      "The federal government should cancel existing student debt",
      "Persons below poverty level, percent, 2009-2013",
      "Voting while incarcerated",
      "The federal government should guarantee a job to every american",
      "Retail sales per capita, 2007",
      "Get rid of private insurance",
      "Supports returning federal corporate income tax rate to 35%",
      "Supports national rent control cap",
      "Supports medicare for all",
      "Believes there should be criminal penalties for people crossing the border",
      "Native Hawaiian and Other Pacific Islander alone, percent, 2014",
      "Total number of firms, 2007",
      "Population, percent change - April 1, 2010 to July 1, 2014",
      "Retail sales, 2007 ($1,000)",
      "Persons under 5 years, percent, 2014",
      "Tax assets held by the wealthiest americans",
      "Persons 65 years and over, percent, 2014",
      "Two or More Races, percent, 2014",
      "Hispanic-owned firms, percent, 2007",
      "Building permits, 2014",
      "Commits to lowering debt-to-GDP ratio during first term",
      "Supports paid family leave more than 12 weeks",
      "Ban  fracking",
      "# of Twitter followers",
      "Open to meeting north korean leader without nuclear concessions",
      "% Donations Under $200",
      "Private nonfarm employment, percent change, 2012-2013",
      "Supports cannabis legalization",
      "Merchant wholesaler sales, 2007 ($1,000)",
      "Supports joining TPP",
      "Women-owned firms, percent, 2007",
      "Supports setting a price on carbon",
      "Candidate committee money"
    ],
    title: {
      text: null
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: "",
      align: "high"
    },
    labels: {
      overflow: "justify"
    }
  },

  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  series: [
    {
      name: "Feature Importance",
      color: "#9bd130",
      data: [
        0.054338931,
        0.051897658,
        0.036364802,
        0.030299761,
        0.024179013,
        0.024010193,
        0.023634212,
        0.021358286,
        0.02112633,
        0.020429239,
        0.01945331,
        0.01940729,
        0.019227134,
        0.017686678,
        0.017549902,
        0.017087986,
        0.017008214,
        0.016912593,
        0.016768957,
        0.0163054,
        0.015497411,
        0.015415307,
        0.015250925,
        0.01503704,
        0.015036632,
        0.014881676,
        0.014750371,
        0.014613914,
        0.014473953,
        0.01432,
        0.014213997,
        0.01414475,
        0.014037464,
        0.01391488,
        0.013674493,
        0.013127434,
        0.013098065,
        0.012988204,
        0.012920908,
        0.012833428,
        0.012624562,
        0.012404991,
        0.01229908,
        0.012224584,
        0.012181602,
        0.011867229,
        0.011770302,
        0.01123987,
        0.010889055,
        0.010659276,
        0.010622139,
        0.010581797,
        0.010440111,
        0.010348721,
        0.010208673,
        0.009875175,
        0.009633757,
        0.008746234,
        0.008746048,
        0.008604799,
        0.007860875,
        0.006894377
      ]
    }
  ],

  navigation: {
    buttonOptions: {
      enabled: false
    }
  }
});

  })

})




/////////////////////////////////////////////////
// Highcharts theme
/////////////////////////////////////////////////

/* global document */
// Load the fonts
Highcharts.createElement('link', {
    href: 'https://fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);
Highcharts.theme = {
  "colors": [
    "#76a21e",
    "#6b591d"
    ],
    "chart": {
      "backgroundColor": "#272822",
      "style": {
      "fontFamily": "Inconsolata",
      "color": "#A2A39C"
    }
    },
    "title": {
      "style": {
      "color": "#A2A39C"
      },
      "align": "left"
    },
    "subtitle": {
      "style": {
      "color": "#A2A39C"
    },
    "align": "left"
    },
    "legend": {
      "align": "right",
      "verticalAlign": "bottom",
      "itemStyle": {
      "fontWeight": "normal",
      "color": "#A2A39C"
      }
    },
    "xAxis": {
      "gridLineDashStyle": "Dot",
      "gridLineWidth": 1,
      "gridLineColor": "#A2A39C",
      "lineColor": "#A2A39C",
      "minorGridLineColor": "#A2A39C",
      "tickColor": "#A2A39C",
      "tickWidth": 1,
      labels: {
        style: {
          fontSize: '20px'
        }
      }
    },
    "yAxis": {
      "gridLineDashStyle": "Dot",
      "gridLineColor": "#A2A39C",
      "lineColor": "#A2A39C",
      "minorGridLineColor": "#A2A39C",
      "tickColor": "#A2A39C",
      "tickWidth": 1,
      labels: {
        style: {
          fontSize: '13px'
        }
      },
      title: {
        style: {
          fontSize: '16px'
        }
      }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#F0F0F3',
                style: {
                    fontSize: '13px'
                }
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        },
        title: {
            style: {
                color: '#C0C0C0'
            }
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },
    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },
    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
                color: '#CCC'
            },
            states: {
                hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: '#000003',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                }
            }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
        },
        labelStyle: {
            color: 'silver'
        }
    },
    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },
    scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
    }
};
// Apply the theme
Highcharts.setOptions(Highcharts.theme);