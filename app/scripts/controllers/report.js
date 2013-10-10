'use strict';

angular.module('nutrientApp')
  .controller('ReportCtrl', function ($scope, NutrientService) {
    
    $scope.customer = NutrientService.getAnalysisResult();
    $scope.test = $scope.customer.fullname;
  });
