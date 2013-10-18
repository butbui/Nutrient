'use strict';

angular.module('nutrientApp')
  .controller('ReportCtrl', function ($scope, NutrientService) {
    var STANDARD_DETAIL = {
      dam: {minValue:13, maxValue:15},
      duong: {minValue:55, maxValue:60},
      beo: {minValue:20, maxValue:25}
    };

    var STANDARD_ENERGY = {
      'Nam': {
        60:[1900, 2200, 0],
        30:[2200, 2700, 3200],
        18:[2300, 2700, 3200]
        },
      'Nữ': {
        60:[1800, 0, 0],
        30:[2100, 2200, 2600],
        18:[2200, 2300, 2600]
        }
    };

    var LEVEL = ["less", "enough", "over"];

    var identifyDetailLevel = function (field) {
      var level = LEVEL[0];
      if ($scope.result.percentage[field] < STANDARD_DETAIL[field].minValue) {
        level = LEVEL[0];
      } else if ($scope.result.percentage[field] > STANDARD_DETAIL[field].maxValue) {
        level = LEVEL[2];
      } else {
        level = LEVEL[1];
      }
      return level;
    }

    function getAge(yearOfBirth) {
      var currentYear = new Date().getFullYear();
      return currentYear - parseInt(yearOfBirth);
    }

    function identifyEnergyLevel() {
      // default value
      var standardEnergy = 0;
      var level = LEVEL[0];

      // get input
      var actualEnergy = $scope.result.energy.nangluong;
      var gender = $scope.customer.gender;
      var age = getAge($scope.customer.yearOfBirth);
      var typeOfWork = $scope.customer.typeOfWork;
      // identify level
      var mapAge = 0;
      for (var a in STANDARD_ENERGY[gender]) {
        if (age > a) {
          mapAge = a;
          break;
        }
      }
      if (mapAge > 0) {
        standardEnergy = STANDARD_ENERGY[gender][mapAge][typeOfWork];

        if (actualEnergy < standardEnergy) {
          level = LEVEL[0];
        } else if (actualEnergy > standardEnergy) {
          level = LEVEL[2];
        } else {
          level = LEVEL[1];
        }
      }
      return {standardEnergy: standardEnergy, level: level};
    }

    $scope.customer = NutrientService.getCustomer();
    $scope.menu = NutrientService.getMenu();
    $scope.result = NutrientService.analyseNutrition($scope.menu);
    // identify level
    $scope.level = {};
    $scope.level.dam = identifyDetailLevel('dam');
    $scope.level.duong = identifyDetailLevel('duong');
    $scope.level.beo = identifyDetailLevel('beo');
    $scope.level.nangluong = identifyEnergyLevel();
    
  });
