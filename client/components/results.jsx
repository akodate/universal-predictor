import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactHighcharts from 'react-highcharts';
require('highcharts-more')(ReactHighcharts.Highcharts);
require('highcharts-heatmap')(ReactHighcharts.Highcharts);

const Results = (props) => {
  results = props.location.state
  const labels = results.classNames;

  // Formats (pre-transformed) confusion matrix as chart data
  let chartData = [];
  for (let [i, col] of results.cnfMatrix.entries()) {
    for (let [i2, x] of col.entries()) {
      chartData.push([i, i2, x]);
    }
  }

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
          text: 'Predicted class'
        }
    },

    yAxis: {
        categories: labels,
        title: {
          text: 'True class'
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
            return '<b>' + this.point.value + '</b> actually <b>' + this.series.yAxis.categories[this.point.y] + 
            '</b>, predicted as <b>' + this.series.xAxis.categories[this.point.x] + '</b>';
        }
    },

    series: [{
        name: 'Predicted vs. Actual Classes',
        borderWidth: 1,
        data: chartData,
        dataLabels: {
            enabled: true,
            color: '#000000'
        }
    }]
  };

  return (
    <div>
      <ReactHighcharts config={config}></ReactHighcharts>
    </div>
  );
};

export default Results;