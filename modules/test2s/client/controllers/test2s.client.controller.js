(function () {
  'use strict';

  // Test2s controller
  angular
    .module('test2s')
    .controller('Test2sController', Test2sController);

  Test2sController.$inject = ['$scope', '$state', '$window', 'Authentication', 'test2Resolve'];

  function Test2sController ($scope, $state, $window, Authentication, test2) {
    var vm = this;

    vm.authentication = Authentication;
    vm.test2 = test2;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Test2
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.test2.$remove($state.go('test2s.list'));
      }
    }

    // Save Test2
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.test2Form');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.test2._id) {
        vm.test2.$update(successCallback, errorCallback);
      } else {
        vm.test2.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('test2s.view', {
          test2Id: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
