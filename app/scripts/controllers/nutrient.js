'use strict';

angular.module('nutrientApp')
  .controller('NutrientCtrl', function ($scope, $location, NutrientService) {
    $scope.page = 'menu';
    $scope.menu = [];
    $scope.times = [
      {label: 'Sáng', value: 'Sáng'},
      {label: 'Trưa', value: 'Trưa'},
      {label: 'Chiều', value: 'Chiều'}
    ];
    // Set default value for gender (M)
    $scope.customer = {gender: 'Nam'};
    // Set default value for Bua an (Sang)
    $scope.meal = {
      time: $scope.times[0]
    };
    // get food from json
    NutrientService.getFoods().then(function (data) {
      $scope.foods = data;
      $scope.meal.food = data[0];
    });
    // Add food to list
    $scope.saveFood = function() {
      $scope.menu.push(angular.copy($scope.meal));
      // analysis
      $scope.result = NutrientService.analyseNutrition($scope.menu);
    };

    $scope.exportToWeb = function() {
      console.log("exportToWeb....");      
      $scope.page = 'result';
    };
   
});
