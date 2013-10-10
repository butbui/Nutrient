'use strict';

angular.module('nutrientApp')
  .controller('NutrientCtrl', function ($scope, $location, NutrientService) {
    $scope.page = 'menu';
    $scope.menu = [];
    $scope.times = [
      {label: 'Sáng', value: 'Sáng'},
      {label: 'Trưa', value: 'Trưa'},
      {label: 'Chiều', value: 'Chiều'},
      {label: 'Trái Cây & Thức uống', value: 'Trái Cây & Thức uống'}
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
        alert("Xin chọn món ăn và số lượng");
        return;
      }
    
      $scope.menu.push(angular.copy($scope.meal));
      // analysis
      $scope.result = NutrientService.analyseNutrition($scope.menu);
    };

    $scope.exportToWeb = function() {
      console.log("exportToWeb....");      
      $scope.page = 'result';
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
