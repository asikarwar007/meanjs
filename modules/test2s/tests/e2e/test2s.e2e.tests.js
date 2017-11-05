'use strict';

describe('Test2s E2E Tests:', function () {
  describe('Test Test2s page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/test2s');
      expect(element.all(by.repeater('test2 in test2s')).count()).toEqual(0);
    });
  });
});
