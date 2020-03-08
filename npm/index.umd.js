if (process.env.NODE_ENV === 'production') {
    module.exports = require('./memo-render.umd.production.js');
} else {
    module.exports = require('./memo-render.umd.development.js');
}
