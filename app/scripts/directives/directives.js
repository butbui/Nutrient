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
  .directive("menu", function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {
        menu: '='
      },
      link: function (scope, elm, attrs, ctrl) {
        var trs = [];
        var tongNangLuong = 0;
        var tongDam = 0;
        var tongDuong = 0;
        var tongBeo = 0;

        for (var time in scope.menu) {
          var items = scope.menu[time];
          for (var i = 0; i < items.length; i++) {
              var item = items[i];
              
              tongNangLuong += (item.quantity * item.food.nangluong);
              tongDam += (item.quantity * item.food.dam * 4);
              tongDuong += (item.quantity * item.food.duong * 4);
              tongBeo += (item.quantity * item.food.beo * 9);

              trs.push('<tr>');
              if (i == 0) {
                trs.push('<td class="colorSubTitle" rowspan="' + items.length + '">' + time +'</td>');
              }
              
              trs.push("<td style='text-align:left'>" + item.food.thucan + '</td>');
              trs.push('<td>' + item.quantity + '</td>');
              trs.push('<td>' + (item.quantity * item.food.nangluong).toFixed(1) + '</td>');
              trs.push('<td>' + (item.quantity * item.food.dam * 4).toFixed(1) + '</td>');
              trs.push('<td>' + (item.quantity * item.food.duong * 4).toFixed(1) + '</td>');              
              trs.push('<td>' + (item.quantity * item.food.beo * 9).toFixed(1) + '</td>');
              trs.push('<td>' + (item.quantity * item.food.vitamin).toFixed(1) + '</td>');
              trs.push('</tr>');
              
          }
        }
        trs.push('<tr class="tr-tong">');
        trs.push('<td class="td-label" colspan="3">Tổng:</td>');
        trs.push('<td class="td-value">' + tongNangLuong.toFixed(1) + '</td>');
        trs.push('<td class="td-value">' + tongDam.toFixed(1) + '</td>');
        trs.push('<td class="td-value">' + tongDuong.toFixed(1) + '</td>');
        trs.push('<td class="td-value">' + tongBeo.toFixed(1) + '</td>');
        trs.push('</tr>');
        elm.append(trs.join(''));
      } 
    }
  })
;
