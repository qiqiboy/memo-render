if (process.env.NODE_ENV === 'production') {
    module.exports = require('./memo-render.esm.production.js');
} else {
    module.exports = require('./memo-render.esm.development.js');
}
