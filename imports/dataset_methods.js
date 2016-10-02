import fs from 'fs';
import parse from 'csv-parse';
import path from 'path';
import Future from 'fibers/future';

Meteor.methods({
  // Uses futures to asynchronously read, write, parse, and return the column names
  'getColNames': function() {
    const future = new Future();

    // TODO: Stop this from streaming the entire dataset just to get column names
    const parser = parse({delimiter: ','}, function(err, data){
      const colNames = data[0];
      future.return(colNames);
    });

    dataset_path = path.resolve('../../../../../datasets~/test.csv');
    console.log('Dataset path to get column names from:', dataset_path);
    fs.createReadStream(dataset_path).pipe(parser);
    return future.wait();
  }
});