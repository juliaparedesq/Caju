// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest, NotAcceptable } = require('@feathersjs/errors');
const mime = require('mime-types');
const crypto = require('crypto');
const moment = require('moment');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.params.file){
      let originalNameSplit = context.params.file.originalname.split('.');
      if (originalNameSplit.length <= 1) {
        return Promise.reject(new BadRequest(`The file needs to have an extension.`));
      }
      let fileName = originalNameSplit.slice(0, originalNameSplit.length - 1).join('');
      let extension = originalNameSplit[originalNameSplit.length - 1];
      // if (!['pdf', 'jpeg', 'jpg', 'png'].includes(extension)) {
      //   return Promise.reject(new BadRequest(`Extension '${extension}' is not supported.`));
      // }

      const file = context.params.file;

      if (file.size > (context.app.get('files').size * 1024 * 1024)) {
        return Promise.reject(new NotAcceptable(`File is larger than the ${context.app.get('files').size}Mb permitted.`));
      }
      context.data.originalName = fileName;
      context.data.buffer = file.buffer;
      context.data.extension = extension;
      context.data.contentType = mime.lookup(extension);
      context.data.uploadedById = context.params.user.id;
      context.data.id =  `${crypto.createHash('md5').update(
          `${moment().format('YYYY-MM-DD_HH:mm:ss')}_${fileName}`
      ).digest('hex')}.${extension}`;
    }
    return context;
  };
};
