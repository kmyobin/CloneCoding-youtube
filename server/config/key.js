if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}

// local에서 할 수도 있고, prod에서 할 수도 있기 때문에