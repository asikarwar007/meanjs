(function () {
  'use strict';

  angular
    .module('test2s')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('test2s', {
        abstract: true,
        url: '/test2s',
        template: '<ui-view/>'
      })
      .state('test2s.list', {
        url: '',
        templateUrl: 'modules/test2s/client/views/list-test2s.client.view.html',
        controller: 'Test2sListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Test2s List'
        }
      })
      .state('test2s.create', {
        url: '/create',
        templateUrl: 'modules/test2s/client/views/form-test2.client.view.html',
        controller: 'Test2sController',
        controllerAs: 'vm',
        resolve: {
          test2Resolve: newTest2
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Test2s Create'
        }
      })
      .state('test2s.edit', {
        url: '/:test2Id/edit',
        templateUrl: 'modules/test2s/client/views/form-test2.client.view.html',
        controller: 'Test2sController',
        controllerAs: 'vm',
        resolve: {
          test2Resolve: getTest2
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Test2 {{ test2Resolve.name }}'
        }
      })
      .state('test2s.view', {
        url: '/:test2Id',
        templateUrl: 'modules/test2s/client/views/view-test2.client.view.html',
        controller: 'Test2sController',
        controllerAs: 'vm',
        resolve: {
          test2Resolve: getTest2
        },
        data: {
          pageTitle: 'Test2 {{ test2Resolve.name }}'
        }
      });
  }

  getTest2.$inject = ['$stateParams', 'Test2sService'];

  function getTest2($stateParams, Test2sService) {
    return Test2sService.get({
      test2Id: $stateParams.test2Id
    }).$promise;
  }

  newTest2.$inject = ['Test2sService'];

  function newTest2(Test2sService) {
    return new Test2sService();
  }
}());
