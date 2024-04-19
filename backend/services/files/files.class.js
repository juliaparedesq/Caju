const { Service } = require('feathers-sequelize');
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const { BadRequest } = require('@feathersjs/errors');

exports.Files = class Files extends Service {
    setup(app) {
        this.app = app;
    }

    async find(params) {
        let lightWeight = params?.query?.lightWeight;
        delete params?.query?.lightWeight;

        let response = await super.find(params);

        if (!lightWeight) {
            for (let i = 0; i < response.data.length; i++) {
                const filesDirectory = this.app.get("files").directory;
                const blobStorage = fs(filesDirectory);
                response.data[i].file = await blobService({Model: blobStorage}).get(response.data[i].name);
            }
        }
        return response;
    }

    async get(id, params) {
        let lightWeight = params?.query?.lightWeight;
        delete params?.query?.lightWeight;

        let response = await super.get(id, params);
        if (!lightWeight) {
            const filesDirectory = this.app.get("files").directory;
            const blobStorage = fs(filesDirectory);
            response.file = await blobService({Model: blobStorage}).get(response.name);
        }
        return response;
    }

    create(data, params) {
        const filesDirectory = this.app.get("files").directory;
        const blobStorage = fs(filesDirectory);
        return blobService({Model: blobStorage}).create(data, params).then((result) => {
            data.name = result.id;
            data.size = result.size;
            data.path = `${filesDirectory}/${result.id}`;
            delete data.id;
            return super.create(data, params);
        });
    }
    async update(id, data, params) {
        let oldFile = this.app.service("api/files").get(id);

        if (data.patientId !== oldFile.patientId) {
            return Promise.reject(new BadRequest('Cannot change the patient of this file'))
        }
        if (data.file) {
            return Promise.reject(new BadRequest('Cannot update a file'))
        }
        data.uploadedById = params.user.id;
        return super.update(id, data, params);

    }
    async patch(id, data, params) {
        if (id) {
            let oldFile = this.app.service("api/files").get(id);
            if (data.patientId !== oldFile.patientId) {
                return Promise.reject(new BadRequest('Cannot change the patient of this file'))
            }
        }
        if (data.file) {
            return Promise.reject(new BadRequest('Cannot patch files'))
        }
        if (data.patientId) {
            return Promise.reject(new BadRequest('Cannot patch the patient for files'))
        }
        data.uploadedById = params.user.id;
        return super.patch(id, data, params);
    }
    async remove(id, params) {
        let file = await this.app.service("api/files").get(id);
        const filesDirectory = this.app.get("files").directory;
        const blobStorage = fs(filesDirectory);
        return blobService({Model: blobStorage}).remove(file.name).then(() => {
            return super.remove(id, params);
        });
    }
};
