const base = require('./cypress.config');

module.exports = {
    ...base,
    env: {
        ...(base.env || {}),
        userEmail: 'userm@mail.com',
        userPassword: 'Password777',
    },
    e2e: {
        ...base.e2e,
        baseUrl: 'https://guest:welcome2qauto@qauto2.forstudy.space',
    },
};


