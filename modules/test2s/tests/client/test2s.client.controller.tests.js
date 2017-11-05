(function () {
  'use strict';

  describe('Test2s Controller Tests', function () {
    // Initialize global variables
    var Test2sController,
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

      // create mock Test2
      mockTest2 = new Test2sService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Test2 Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Test2s controller.
      Test2sController = $controller('Test2sController as vm', {
        $scope: $scope,
        test2Resolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTest2PostData;

      beforeEach(function () {
        // Create a sample Test2 object
        sampleTest2PostData = new Test2sService({
          name: 'Test2 Name'
        });

        $scope.vm.test2 = sampleTest2PostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Test2sService) {
        // Set POST response
        $httpBackend.expectPOST('api/test2s', sampleTest2PostData).respond(mockTest2);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Test2 was created
        expect($state.go).toHaveBeenCalledWith('test2s.view', {
          test2Id: mockTest2._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/test2s', sampleTest2PostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Test2 in $scope
        $scope.vm.test2 = mockTest2;
      });

      it('should update a valid Test2', inject(function (Test2sService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/test2s\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('test2s.view', {
          test2Id: mockTest2._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (Test2sService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/test2s\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Test2s
        $scope.vm.test2 = mockTest2;
      });

      it('should delete the Test2 and redirect to Test2s', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/test2s\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('test2s.list');
      });

      it('should should not delete the Test2 and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
