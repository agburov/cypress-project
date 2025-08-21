const base = require('./cypress.config');

module.exports = {
    ...base,
    env: {
        ...(base.env || {}),
        userEmail: 'usert@mail.com',
        userPassword: 'Password123',
    },
    e2e: {
        ...base.e2e,
        baseUrl: 'https://guest:welcome2qauto@qauto.forstudy.space',
    },
};


