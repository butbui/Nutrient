'use strict';

/* Filters */

angular.module('nutrientDirectives', [])
  .directive('autocomplete', function($parse) {
	  return function(scope, element, attrs) {
      var f = $parse(attrs['autocomplete']);
      element.autocomplete({
            minLength: 0,
            cacheLength: 0,
            source: function (request, response) {
              var re = $.ui.autocomplete.escapeRegex(request.term);
              var matcher = new RegExp( re, "i" );
              var list = [];
              for (var i = 0; i < scope.foods.length; i++) {
                var food = scope.foods[i];
                if (food.buoi !== scope.meal.time.value) {
                  continue;
                }

                if (matcher.test(food.thucan)) {
                  list.push({
                    food: food,
                    value: food.thucan
                  });
                }
              }
              response(list);
            },
            select: function (event, ui) {
                //scope[attrs['autocomplete']] = ui.item.food;
                f.assign(scope, ui.item.food);
                scope.$apply();
            },
            /*focus:function (event, ui) {
                element.val(ui.item.label);
                return false;
            },*/
            change: function (event, ui) {
                if (ui.item === null) {
                  element.val('');                  
                  //scope[attrs['autocomplete']] = null;
                  f.assign(scope, null);
                  scope.$apply();
                  
                }
                return false;
            }
        }).focus(function(){         
            //$(this).trigger('keydown');
            $(this).autocomplete("search", $(this).val());
        });
	  };
  })
;
