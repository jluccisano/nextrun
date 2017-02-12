var path = require('path');
var srcDir = path.join(__dirname, 'server', 'config/middlewares');

require('blanket')({
  // Only files that match the pattern will be instrumented
  pattern: srcDir
});