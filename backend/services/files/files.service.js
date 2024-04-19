// Initializes the `files` service on path `/api/files`
const { Files } = require('./files.class');
const createModel = require('../../models/files.model');
const hooks = require('./files.hooks');

// Middleware
const multer = require('multer');
const multipartMiddleware = multer().single('file');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/files',
      function(req,res,next){
        if(req.method.toLowerCase() === 'post') {
          // multer parses the file named 'file'.
          // Without extra params the data is
          // temporarely kept in memory
          return multipartMiddleware(req, res, next);
        }
        next();
      },
      // another middleware, this time to
      // transfer the received file to feathers
      function(req,res,next){
        if(req.method.toLowerCase() === 'post') {
          req.feathers.file = req.file;
          req.feathers.patientId = req.body.patientId;
          req.feathers.date = req.body.date;
          req.feathers.type = req.body.type;
        }
        next();
      },
      new Files(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/files');

  service.hooks(hooks);
};
