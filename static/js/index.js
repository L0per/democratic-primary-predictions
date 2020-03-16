/*
TODO:
- Check data labels after drilling. Label rank? New positions?
*/
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

d3.json('http://127.0.0.1:5000/api/results').then(function(result,error) {

  var data = Highcharts.geojson(Highcharts.maps['countries/us/us-all']),
    separators = Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'mapline'),
    // Some responsiveness
    small = $('#container').width() < 400;


  // Set drilldown pointers
  $.each(data, function (i) {
    this.drilldown = this.properties['hc-key'];
    this.value = getRandomInt(2); // Non-random bogus data
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
    this.value = getRandomInt(2); // Non-random bogus data
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
