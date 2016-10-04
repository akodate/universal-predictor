import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactHighcharts from 'react-highcharts';
require('highcharts-more')(ReactHighcharts.Highcharts);
require('highcharts-heatmap')(ReactHighcharts.Highcharts);

const Results = (props) => {
  const labels = props.results.labels;
  const config = {
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
        categories: labels,
        title: {
          text: 'Predicted label'
        }
    },

    yAxis: {
        categories: labels,
        title: {
          text: 'True label'
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
            return this.point.value;
        }
    },

    series: [{
        name: 'Predicted vs. Actual Classes',
        borderWidth: 1,
        data: [[0, 0, 10], [0, 1, 19], [1, 0, 8], [1, 1, 24]],
        dataLabels: {
            enabled: true,
            color: '#000000'
        }
    }]
  };

  return (
    <div>
      <div>RESULTS</div>
      <ReactHighcharts config={config}></ReactHighcharts>
    </div>
  );
};

export default Results;