// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const sequelize = require('sequelize');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {
        let orgId = context.params.user?.organizationId;
        if(orgId != null){
            context.params.query.organizationId = orgId;
        };
        return context;
    };
};
