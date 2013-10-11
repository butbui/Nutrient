'use strict';

angular.module('nutrientApp')
  .controller('NutrientCtrl', function ($scope, $location, NutrientService) {
    $scope.page = 'menu';
    $scope.menu = [];
    $scope.times = [
      {label: 'Sáng', value: 'Sáng', order:1},
      {label: 'Trưa', value: 'Trưa', order:2},
      {label: 'Chiều', value: 'Chiều', order:3},
      {label: 'Trái Cây& Thức uống', value: 'Trái Cây& Thức uống', order:4}
    ];
    // Set default value for gender (M)
    $scope.customer = {gender: 'Nam'};
    // Set default value for Bua an (Sang)
    $scope.meal = {
      time: $scope.times[0],
      quantity: 1
    };
    // get food from json
    NutrientService.getFoods().then(function (data) {
      $scope.foods = data;
    });
    // Add food to list
    $scope.saveFood = function() {
      if (isEmpty($scope.meal.time) || isEmpty($scope.meal.food) || isEmpty($scope.meal.quantity)) {
        window.alert("Xin chọn món ăn và số lượng");
        return;
      }
      if (isNaN($scope.meal.quantity)) {
        window.alert("Xin nhập số lượng bằng số");
        return;
      }
    
      $scope.menu.push(angular.copy($scope.meal));
      // analysis
      //$scope.result = NutrientService.analyseNutrition($scope.menu);
    };

    $scope.exportToWeb = function() {
      //console.log("exportToWeb....");      
      //$scope.page = 'result';
      NutrientService.saveCustomer($scope.customer);
      NutrientService.analyseNutrition($scope.menu);
      $location.path('/report');
    };

    $scope.timeChanged = function() {
      console.log('time changed');
      $('input[autocomplete]').val('');
      $scope.meal.food = null;
    }

    function isEmpty(val) {
      return (val === undefined || val === null || val === '');
    }
   
});
