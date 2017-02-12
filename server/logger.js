  var winston = require("winston"),
    underscore = require("underscore"),
    env = process.env.NOD_ENV || "development",
    config = require("../config/config")[env];


  // Set up logger
  var customColors = {
    trace: "white",
    debug: "green",
    info: "green",
    warn: "yellow",
    error: "red",
    fatal: "red"
  };

  var logger = new(winston.Logger)({
    colors: customColors,
    levels: {
      trace: 0,
      debug: 1,
      info: 2,
      warn: 3,
      error: 4,
      fatal: 5
    },
    transports: [
      new(winston.transports.Console)({
        level: config.logLevel,
        colorize: true,
        timestamp: true
      }),
      new(winston.transports.File)({
        filename: "out.log",
        level: config.logLevel,
        timestamp: true
      })
    ]
  });

  winston.addColors(customColors);

  // Extend logger object to properly log "Error" types
  var origLog = logger.log;

  logger.log = function(level, msg) {
    var objType = Object.prototype.toString.call(msg);
    if (objType === "[object Error]") {
      origLog.call(logger, level, msg.toString());
    } else {
      origLog.call(logger, level, msg);
    }
  };

  logger.isLevelEnabled = function(level) {
    return underscore.any(this.transports, function(transport) {
      return (transport.level && this.levels[transport.level] <= this.levels[level]) || (!transport.level && this.levels[this.level] <= this.levels[level]);
    }, this);
  };


  module.exports = logger;