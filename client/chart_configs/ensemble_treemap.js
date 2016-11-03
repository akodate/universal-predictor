import ReactHighcharts from 'react-highcharts';

const setEnsembleTreemapConfig = () => {
  const ensembleTreemapConfig = {
    chart: {
      type: 'treemap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1
    },
    colorAxis: {
        minColor: '#FFFFFF',
        maxColor: ReactHighcharts.Highcharts.getOptions().colors[0]
    },
    series: [{
        // type: 'treemap',
        layoutAlgorithm: 'squarified',
        data: [{
            name: 'A',
            value: 6,
            colorValue: 1
        }, {
            name: 'B',
            value: 6,
            colorValue: 2
        }, {
            name: 'C',
            value: 4,
            colorValue: 3
        }, {
            name: 'D',
            value: 3,
            colorValue: 4
        }, {
            name: 'E',
            value: 2,
            colorValue: 5
        }, {
            name: 'F',
            value: 2,
            colorValue: 6
        }, {
            name: 'G',
            value: 1,
            colorValue: 7
        }]
    }],
    title: {
        text: 'Highcharts Treemap'
    }
  }
  return ensembleTreemapConfig;
};

export default setEnsembleTreemapConfig;