var science = require('scientist/console');

// Guarantee we have a promise so all version of node can use this
var Promise = require('bluebird');

module.exports = function (name, block, next) {
  science(name, function (experiment) {
    experiment.async(true);
    
    // Overwrite #try()
    experiment.try = function (name, block) {
      if (!block) {
        block = name;
        name = "candidate";
      }
      
      experiment.constructor.prototype.try.call(experiment, name, function () {
        
        // Wrap callback as promise since science itself expects a promise
        return new Promise( function (resolve, reject) {
          block( function (error, result) {
            error ? reject(error) : resolve(result);
          });
        });
      });
    };

    block(experiment);
  }).then(
    function (res) { next(null, res) }, 
    function (err) { next(err, null) }
  );
};