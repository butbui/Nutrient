'use strict';

angular.module('nutrientApp')
  .controller('ReportCtrl', function ($scope, NutrientService) {
    var STANDARD = {
      dam: {minValue:13, maxValue:15},
      duong: {minValue:55, maxValue:60},
      beo: {minValue:20, maxValue:25}
    };
    var LEVEL = ["less", "enough", "over"];

    var identifyLevel = function (field) {
      var level = LEVEL[0];
      if ($scope.result.percentage[field] < STANDARD[field].minValue) {
        level = LEVEL[0];
      } else if ($scope.result.percentage[field] > STANDARD[field].maxValue) {
        level = LEVEL[2];
      } else {
        level = LEVEL[1];
      }
      return level;
    }

    $scope.customer = NutrientService.getCustomer();
    $scope.menu = NutrientService.getMenu();
    $scope.result = NutrientService.analyseNutrition($scope.menu);
    // identify level
    $scope.level = {};
    $scope.level.dam = identifyLevel('dam');
    $scope.level.duong = identifyLevel('duong');  
    $scope.level.beo = identifyLevel('beo');

    
  });
