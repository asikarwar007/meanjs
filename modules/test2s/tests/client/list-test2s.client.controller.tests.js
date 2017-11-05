(function () {
  'use strict';

  describe('Test2s List Controller Tests', function () {
    // Initialize global variables
    var Test2sListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Test2sService,
      mockTest2;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Test2sService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Test2sService = _Test2sService_;

      // create mock article
      mockTest2 = new Test2sService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Test2 Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Test2s List controller.
      Test2sListController = $controller('Test2sListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTest2List;

      beforeEach(function () {
        mockTest2List = [mockTest2, mockTest2];
      });

      it('should send a GET request and return all Test2s', inject(function (Test2sService) {
        // Set POST response
        $httpBackend.expectGET('api/test2s').respond(mockTest2List);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.test2s.length).toEqual(2);
        expect($scope.vm.test2s[0]).toEqual(mockTest2);
        expect($scope.vm.test2s[1]).toEqual(mockTest2);

      }));
    });
  });
}());
