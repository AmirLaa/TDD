'use strict';

var utils = require('../utils/writer.js');
var Validation = require('../service/ValidationService');

module.exports.validationGET = function validationGET (req, res, next) {

  Validation.validationGET(req.body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
