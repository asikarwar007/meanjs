// Test2s service used to communicate Test2s REST endpoints
(function () {
  'use strict';

  angular
    .module('test2s')
    .factory('Test2sService', Test2sService);

  Test2sService.$inject = ['$resource'];

  function Test2sService($resource) {
    return $resource('api/test2s/:test2Id', {
      test2Id: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
