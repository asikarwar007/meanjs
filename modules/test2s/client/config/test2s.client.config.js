(function () {
  'use strict';

  angular
    .module('test2s')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'food',
      state: 'test2s',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'test2s', {
      title: 'Food List',
      state: 'test2s.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'test2s', {
      title: 'Create Food',
      state: 'test2s.create',
      roles: ['user']
    });
  }
}());
