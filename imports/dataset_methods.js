import fs from 'fs';
import parse from 'csv-parse';
import path from 'path';
import Future from 'fibers/future';
import { spawn } from 'child_process';

Meteor.methods({

  'runPython': function(scriptName, target=false, time=false) {
    const future = new Future();
    const datasetPath = path.resolve('../../../../../datasets~/test.csv');
    const pythonPath = '/Users/alex/anaconda/envs/p3/bin/python'
    const scriptPath = path.resolve('../../../../../imports/python_scripts/' + scriptName);
    console.log('Running Python script named', scriptName, 'at', scriptPath);

    const proc = spawn(pythonPath, [scriptPath, datasetPath, target, time]);

    let rawData = '';

    proc.stdout.on('data', function (data){
      console.log(data.toString());
      rawData += data.toString();
    });

    proc.stdout.on('end', () => {
      JSONData = rawData.split("***JSON***\n").slice(1).join('');
      console.log('Finished reading output from Python.');
      future.return(JSON.parse(JSONData));
    });

    return future.wait();
  }
});