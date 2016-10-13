import ReactHighcharts from 'react-highcharts';

const setCnfMatrixData = (cnfMatrix) => {
  // Formats confusion matrix as chart data
  let cnfMatrixData = [];
  for (let [i, col] of cnfMatrix.entries()) {
    for (let [i2, x] of col.entries()) {
      cnfMatrixData.push([i, i2, x]);
    }
  }
  return cnfMatrixData;
}

const setCnfMatrixConfig = (cnfMatrix, classNames) => {
  const cnfMatrixData = setCnfMatrixData(cnfMatrix);

  const cnfMatrixConfig = {
    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1
    },

    title: {
      text: 'Confusion Matrix'
    },

    xAxis: {
      categories: classNames,
      title: {
        text: '<b>Predicted class</b>'
      }
    },

    yAxis: {
      categories: classNames,
      title: {
        text: '<b>True class</b>'
      }
    },

    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: ReactHighcharts.Highcharts.getOptions().colors[0]
    },

    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280
    },

    tooltip: {
      formatter: function () {
        return '<strong>' + this.point.value + '</strong> predicted as class <strong>' + this.series.xAxis.categories[this.point.x] + '</strong><br>' + 
          'that are actually class <strong>' + this.series.yAxis.categories[this.point.y] + '</strong>';
      }
    },

    series: [{
      name: 'Predicted vs. Actual Classes',
      borderWidth: 1,
      data: cnfMatrixData,
      dataLabels: {
        enabled: true,
        color: '#000000'
      }
    }]
  };
  return cnfMatrixConfig;
};

export default setCnfMatrixConfig;