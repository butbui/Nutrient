'use strict';

angular.module('nutrientApp')
  .controller('ReportCtrl', function ($scope, NutrientService) {
    $scope.customer = NutrientService.getCustomer();
    $scope.result = NutrientService.getAnalysisResult();
    //console.log($scope.customer);
  });
