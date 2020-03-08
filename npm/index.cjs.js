if (process.env.NODE_ENV === 'production') {
    module.exports = require('./memo-render.cjs.production.js');
} else {
    module.exports = require('./memo-render.cjs.development.js');
}
