(function () {
  'use strict';

  angular
    .module('test2s')
    .controller('Test2sListController', Test2sListController);

  Test2sListController.$inject = ['Test2sService'];

  function Test2sListController(Test2sService) {
    var vm = this;

    vm.test2s = Test2sService.query();
  }
}());
