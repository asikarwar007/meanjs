(function () {
  'use strict';

  describe('Test2s Route Tests', function () {
    // Initialize global variables
    var $scope,
      Test2sService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Test2sService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Test2sService = _Test2sService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('test2s');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/test2s');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          Test2sController,
          mockTest2;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('test2s.view');
          $templateCache.put('modules/test2s/client/views/view-test2.client.view.html', '');

          // create mock Test2
          mockTest2 = new Test2sService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Test2 Name'
          });

          // Initialize Controller
          Test2sController = $controller('Test2sController as vm', {
            $scope: $scope,
            test2Resolve: mockTest2
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:test2Id');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.test2Resolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            test2Id: 1
          })).toEqual('/test2s/1');
        }));

        it('should attach an Test2 to the controller scope', function () {
          expect($scope.vm.test2._id).toBe(mockTest2._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/test2s/client/views/view-test2.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          Test2sController,
          mockTest2;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('test2s.create');
          $templateCache.put('modules/test2s/client/views/form-test2.client.view.html', '');

          // create mock Test2
          mockTest2 = new Test2sService();

          // Initialize Controller
          Test2sController = $controller('Test2sController as vm', {
            $scope: $scope,
            test2Resolve: mockTest2
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.test2Resolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/test2s/create');
        }));

        it('should attach an Test2 to the controller scope', function () {
          expect($scope.vm.test2._id).toBe(mockTest2._id);
          expect($scope.vm.test2._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/test2s/client/views/form-test2.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          Test2sController,
          mockTest2;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('test2s.edit');
          $templateCache.put('modules/test2s/client/views/form-test2.client.view.html', '');

          // create mock Test2
          mockTest2 = new Test2sService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Test2 Name'
          });

          // Initialize Controller
          Test2sController = $controller('Test2sController as vm', {
            $scope: $scope,
            test2Resolve: mockTest2
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:test2Id/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.test2Resolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            test2Id: 1
          })).toEqual('/test2s/1/edit');
        }));

        it('should attach an Test2 to the controller scope', function () {
          expect($scope.vm.test2._id).toBe(mockTest2._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/test2s/client/views/form-test2.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
