// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.data?.name) {
      const filesDirectory = context.app.get("files").directory;
      const blobStorage = fs(filesDirectory);
      return blobService({Model: blobStorage}).remove(context.data.name).then(() => {
        return context;
      });
    }
  };
};
