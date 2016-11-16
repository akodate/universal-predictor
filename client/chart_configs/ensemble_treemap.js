import ReactHighcharts from 'react-highcharts';

const setEnsembleTreemapConfig = (results) => {
  let formattedEnsembleTreemapData = results.formattedEnsembleTreemapData;
  for (let [i, modelInfo] of results.formattedEnsembleTreemapData.entries()) {
    formattedEnsembleTreemapData[i].value = Math.round(modelInfo.value * 1e2) / 1e2;
    formattedEnsembleTreemapData[i].color = ReactHighcharts.Highcharts.getOptions().colors[i];
  }

  /* eslint-disable comma-dangle */
  const ensembleTreemapConfig = {
    chart: {
      type: 'treemap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1,
    },
    credits: false,
    legend: false,
    series: [{
      // type: 'treemap',
      layoutAlgorithm: 'squarified',
      data: formattedEnsembleTreemapData,
    }],
    title: {
      text: 'Model Weights',
    },
    tooltip: {
      formatter() {
        return '<strong>Weight: ' + this.point.value + '</strong><br>' +
        '--------------<br>' +
        '<strong>Configuration</strong>: <br>' +
        Object.keys(this.series.data[this.x].configuration).map(key =>
          key + ': ' + this.series.data[this.x].configuration[key]
          ).join('<br>');
      },
    },
  };
  /* eslint-enable comma-dangle */
  return ensembleTreemapConfig;
};

export default setEnsembleTreemapConfig;
