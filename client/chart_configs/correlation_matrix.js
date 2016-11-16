const setCorrMatrixData = (corrMatrix) => {
  // Formats correlation matrix as chart data
  let corrMatrixData = [];
  for (let [i, col] of corrMatrix.entries()) {
    for (let [i2, x] of col.entries()) {
      corrMatrixData.push([i, i2, x]);
    }
  }
  return corrMatrixData;
};

const setCorrMatrixConfig = (corrMatrix, classNames) => {
  const roundedCorrMatrix = corrMatrix.map(
    row => row.map(
      cell => cell.toFixed(3),
    ),
  );
  const corrMatrixData = setCorrMatrixData(roundedCorrMatrix);

  /* eslint-disable comma-dangle */
  const corrMatrixConfig = {
    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1,
    },

    title: {
      text: 'Pearson Correlation Heatmap',
    },

    xAxis: {
      categories: classNames,
      // title: {
      //   text: '<b>Mouse over for exact values</b>'
      // }
    },

    yAxis: {
      categories: classNames,
      title: {
        text: '<b>Correlatable columns</b>',
      },
    },

    colorAxis: {
      min: -1,
      max: 1,
      stops: [
          [0, '#3060cf'],
          [0.5, '#ffffff'],
          [0.9, '#c4463a'],
      ],
    },

    credits: false,

    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280,
    },

    tooltip: {
      formatter() {
        return '<strong>' + this.point.value + '<strong>';
      },
    },

    series: [{
      name: 'Predicted vs. Actual Classes',
      borderWidth: 1,
      data: corrMatrixData,
      // dataLabels: {
      //   enabled: true,
      //   color: '#000000',
      //   formatter: function () {
      //     return '<strong>' + parseFloat(this.point.value).toFixed(1) + '<strong>';
      //   }
      // }
    }],
  };
  /* eslint-enable comma-dangle */
  return corrMatrixConfig;
};

export default setCorrMatrixConfig;
