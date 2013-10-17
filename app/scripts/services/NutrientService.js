'use strict';

angular.module('nutrientServices', ['LocalStorageModule'])
  .service('NutrientService', function ($q, $http, localStorageService) {
    var analysisResult = {};
    var customer = {}, menu = {};
    return {
      // Function: 
      getFoods: function(coachId) {
        
        var deferred = $q.defer();
        $http.get('dulieu.json')
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function(message) {
            console.log('NutrientService::getFoods: failed to load json data: ' + message);
            deferred.reject(message);
          });
        
        return deferred.promise;
      },
      getAnalysisResult : function() {
        return analysisResult;
      },
      setAnalysisResult : function(result) {
        analysisResult = result;
      },
      analyseNutrition: function(menu) {
        var result = {};
        var damGTotal = 0;
        var beoGTotal = 0;
        var duongGTotal = 0;
        var nangluongKCalTotal = 0;
        var damKCalTotal = 0;
        var beoKCalTotal = 0;
        var duongKCalTotal = 0;
        var item;
        if (angular.isUndefined(menu)) {
          return result;
        }
        for (var buaan in menu) {
          for (var i = 0; i < menu[buaan].length; i++) {
            item = menu[buaan][i];
            // in gam
            damGTotal += item.quantity * item.food.dam;
            beoGTotal += item.quantity * item.food.beo;
            duongGTotal += item.quantity * item.food.duong;
            // in Kcal
            nangluongKCalTotal += item.quantity * item.food.nangluong;
            damKCalTotal += item.quantity * item.food.dam * 4;
            beoKCalTotal += item.quantity * item.food.beo * 9;
            duongKCalTotal += item.quantity * item.food.duong * 4;        
          }
        }

        var energyTotal = damKCalTotal + beoKCalTotal + duongKCalTotal;
        // Dam
        var damPercentage = damKCalTotal / (energyTotal);
        damPercentage = isNaN(damPercentage) ? 0 : damPercentage.toFixed(2) * 100;
        // Beo
        var beoPercentage = beoKCalTotal / (energyTotal);
        beoPercentage = isNaN(beoPercentage) ? 0 : beoPercentage.toFixed(2) * 100;
        // Duong
        var duongPercentage = duongKCalTotal / (energyTotal);
        duongPercentage = isNaN(duongPercentage) ? 0 : duongPercentage.toFixed(2) * 100;

        // amount of food
        result.amountOfFood = {dam: damGTotal, beo: beoGTotal, duong: duongGTotal};
        // amount of energy
        result.energy = {nangluong: nangluongKCalTotal, dam: damKCalTotal, beo: beoKCalTotal, duong: duongKCalTotal};
        // percentage of energy
        result.percentage = {dam: damPercentage, beo: beoPercentage, duong: duongPercentage};
        // total
        var percentageTotal = damPercentage + beoPercentage + duongPercentage;
        result.total = {energy: nangluongKCalTotal, percentage: percentageTotal};

		    analysisResult = angular.copy(result);
        return analysisResult;
	    },
      saveToLocalStorage : function() {
        var localstorageKey = "customerInfo_Nutrition";
    
        var customerList = localStorageService.get(localstorageKey);
        if (!customerList) {
          customerList = [];
        }
        
        //var jsonObj = {customer: customer, result: analysisResult};
        //var jsonObj = {customer: customer, menu: menu};
        var cusObj = {};
        var jsonObj = {};

        for (var i=0 ; i<=100; i++) {
          cusObj = angular.copy(customer);          
          cusObj.fullname += i;
          
          var jsonObj = {customer: cusObj, menu: menu};
          customerList.push(jsonObj);
        }        
        localStorageService.add(localstorageKey, customerList);
      },
      saveCustomer: function (cus) {
        customer = angular.copy(cus);
        console.log(customer);
      },
      getCustomer: function () {
        return customer;
      },
      saveMenu: function (mn) {
        var initMenu = angular.copy(mn);
        menu = {
          'Sáng': [],
          'Trưa': [],
          'Chiều': [],
          'Trái Cây& Thức uống': []
        };

        for (var i = 0; i < initMenu.length; i++) {
          menu[initMenu[i].food.buoi].push(initMenu[i]);
        }
        console.log(menu);
      },
      getMenu: function () {
        return menu;
      }
    };
  });
