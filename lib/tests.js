#!/usr/bin/env node
var suite = require('suite.js');
var g = require('./generators');
var f = require('funkit');

gSuite(g.number(), f.isNumber);
gSuite(g.number(100), f.isNumber);
gSuite(g.number(20, 30), f.partial(f.between, 20, 30));
gSuite(g.upperCharacter, charCodeBetween(65, 90));
gSuite(g.lowerCharacter, charCodeBetween(97, 122));
gSuite(g.character, charCodeBetween(33, 126));
gSuite(g.word(10), function(a) {
    return a.length == 10 && allBetween(a, 33, 126);
});
gSuite(g.structure, function(a) {
    return f.isArray(a) || f.isObject(a) || f.isNumber(a) || f.isString(a);
});
gSuite(g.list(10, g.number(100)), function(a) {
    return f.isArray(a) && f.all(f.isNumber, a);
});

function numberRangeTest() {
    var numberOfTens = 0;
    var cases = 10;

    suite(f.id, suite.generate(cases,
        [g.number(1, 10), g.number(11, 30)],
        function(op, a, b) {
            if(a == 10) numberOfTens++;

            return true;
        })
    );

    return cases != numberOfTens;
}
suite(numberRangeTest, ['', true]);

function gSuite(gen, inv) {
    return suite(inv, suite.generate(1000,
        [gen],
        function(op, a) {
            return op(a);
        }
    ));
}

function allBetween(n, a, b) {
    return f.all(f.id, n.split('').map(charCodeBetween(a, b)));
}

function charCodeBetween(a, b) {
    return function(n) {
        var code = n.charCodeAt(0);
        return a <= code && code <= b;
    };
}

