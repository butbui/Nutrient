'use strict';

angular.module('nutrientApp', ['nutrientServices', 'nutrientFilters', 'nutrientDirectives'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/nutrient.html',
        controller: 'NutrientCtrl'
      })
      .when('/report', {
        templateUrl: 'views/report.html',
        controller: 'ReportCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
