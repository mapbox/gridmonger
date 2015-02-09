var test = require('tape');
var gridmonger = require('../index');

test('Zoom Level 0', function(t) {
    t.deepEqual(
        gridmonger(require('./data/0_0_0.json'), [0,0,0]),
        require('./fixtures/0_0_0.json')
    );
    t.end();
});
