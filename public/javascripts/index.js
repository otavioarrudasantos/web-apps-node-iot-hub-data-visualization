$(document).ready(function () {
  var timeData = [],
    accelerometerData = [],
    gyroscopeData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'accelerometer',
        yAxisID: 'accelerometer',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: accelerometerData
      },
      {
        fill: false,
        label: 'gyroscope',
        yAxisID: 'gyroscope',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: gyroscopeData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'accelerometer & gyroscope Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'accelerometer',
        type: 'linear',
        scaleLabel: {
          labelString: 'accelerometer(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'gyroscope',
          type: 'linear',
          scaleLabel: {
            labelString: 'gyroscope(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.accelerometer) {
        return;
      }
      timeData.push(obj.time);
      accelerometerData.push(obj.accelerometer);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        accelerometerData.shift();
      }

      if (obj.gyroscope) {
        gyroscopeData.push(obj.gyroscope);
      }
      if (gyroscopeData.length > maxLen) {
        gyroscopeData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
