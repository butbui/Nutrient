'use strict';

/* Filters */

angular.module('nutrientFilters', [])
  .filter('total', function() {
	  return function(menu, field) {
        var total = 0;
        var item;
        
        var percentage = 1;
        if (field === "dam") {
          percentage = 4;
        } else if (field === "beo") {
          percentage = 9;
        } else if (field === "duong") {
          percentage = 4;
        }
        for (var i = 0; i < menu.length; i++) {
          item = menu[i];
          total += item.quantity * item.food[field] * percentage;
        }
		    return total;
	  };
  })
  .filter('percentage', function() {
      return function(menu, field) {
          var percentage = 0;
          var damTotal = 0;
          var beoTotal = 0;
          var duongTotal = 0;
          var item;
          
          for (var i = 0; i < menu.length; i++) {
            item = menu[i];
            damTotal += item.quantity * item.food.dam * 4;
            beoTotal += item.quantity * item.food.beo * 9;
            duongTotal += item.quantity * item.food.duong * 4;
          }
          if (field === "dam") {
            percentage = damTotal / (damTotal + beoTotal + duongTotal);
          } else if (field === "beo") {
            percentage = beoTotal / (damTotal + beoTotal + duongTotal);
          } else if (field === "duong") {
            percentage = duongTotal / (damTotal + beoTotal + duongTotal);
          }
          percentage = isNaN(percentage) ? 0 : percentage.toFixed(2);          
		      return percentage * 100;
      };
  })

;
