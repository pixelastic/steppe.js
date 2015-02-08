// `karma-fixture` base directory is hardcoded
// https://github.com/billtrik/karma-fixture/issues/3
// This is the way to update it. It must match `files` definition set in
// `karma.conf.js`
fixture.base = 'test/fixtures';

var iit = it.only;
var xit = it.skip;
var ddescribe = describe.only;
var xdescribe = describe.skip;
