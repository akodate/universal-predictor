import fs from 'fs';
import path from 'path';
import { DatasetMethods } from '../imports/dataset_methods'; // eslint-disable-line no-unused-vars

// Saves file sent by file input in DataSelection component
// TO DO: Create file and folder if they don't exist yet
WebApp.connectHandlers.use('/upload', (req, res) => { // eslint-disable-line no-undef
  const datasetPath = path.resolve('../../../../../datasets~/test.csv');
  console.log('Writing dataset to', datasetPath);
  const file = fs.createWriteStream(datasetPath);

  // file.on('error',function(error){
  //   console.log(error);
  // });
  file.on('finish', () => {
    res.writeHead(200);
    res.end();
    console.log('Finished writing dataset.');
  });

  req.pipe(file);
});
