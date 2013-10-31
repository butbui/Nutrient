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

    var EVALUATE_ENERGY = {
      'less': {
        description: 'Thiếu',
        evaluate: 'Tổng năng lượng thấp hơn mức năng lượng nhu cầu theo khuyến nghị',
        recommend: 'Bổ sung dinh dưỡng theo đường uống với sữa cao năng lượng, giàu đạm, đầy đủ vitamin và khoáng chất, kết hợp chế độ ăn đầy đủ chất, cân đối, đa dạng các lọai thực phẩm'
      },
      'enough': {
        description: 'Đủ',
        evaluate: 'Đạt mức năng lượng nhu cầu theo khuyến nghị',
        recommend: 'Cần áp dụng chế độ dinh dưỡng hợp lý gồm đầy đủ, đa dạng các lọai thực phẩm, đảm bảo 4 nhóm thực phẩm chính(đạm, đường, béo, vitamin), kết hợp uống bồ sung 1- 2 ly sữa /ngày'
      },
      'over': {
        description: 'Thừa',
        evaluate: 'Tổng năng lượng cao hơn mức năng lượng nhu cầu theo khuyến nghị',
        recommend: 'Bớt ăn các món nhiều tinh bột (cơm, bánh mì…), bớt mỡ, đường, thịt, không ăn vặt, ăn đêm, tăng cường vận động, hạn chế rượu bia'
      }
    };
    var EVALUATE_DETAIL = {};
    EVALUATE_DETAIL.dam = {
      'less': {
        description: 'Thiếu',
        evaluate: 'Đạm cung cấp thiếu. Nguy cơ: Suy dinh dưỡng, phù do giảm đạm máu, teo cơ, loãng xương, suy nhược cơ thể, thiếu máu, vết thương lâu lành.',
        recommend: 'Bổ sung dinh dưỡng theo đường uống với sữa đầy đủ và cân đối, với đạm chất lượng cao kết hợp chế độ ăn giàu thịt trắng, cá, trứng, đậu…'
      },
      'enough': {
        description: 'Đủ',
        evaluate: '',
        recommend: ''
      },
      'over': {
        description: 'Thừa',
        evaluate: 'Đạm cung cấp vượt nhu cầu theo khuyến nghị. Nguy cơ: Thừa cân, cholesterol máu cao, bệnh tim mạch, loãng xương, bệnh thận, gút.',
        recommend: 'Giảm bớt các thức ăn giàu đạm như thịt bò, các lọai thịt trắng như cá phi lê, trứng, đậu hũ, các lọai đậu.'
      }
    };

    EVALUATE_DETAIL.duong = {
      'less': {
        description: 'Thiếu',
        evaluate: 'Đường cung cấp thiếu. Nguy cơ: Thiếu năng lượng, suy dinh dưỡng.',
        recommend: 'Bổ sung dinh dưỡng theo đường uống, kết hợp ăn thêm tinh bột, các lọai ngũ cốc (cơm, khoai, mì, bắp, bún…), trái cây ngọt.'
      },
      'enough': {
        description: 'Đủ',
        evaluate: '',
        recommend: ''
      },
      'over': {
        description: 'Thừa',
        evaluate: 'Đường cung cấp vượt nhu cầu khuyến nghị.  Nguy cơ: Thừa cân, béo phì và các biến chứng của thừa cân, béo phì, gan nhiễm mỡ, tăng triglyceride máu, đái tháo đường type 2…',
        recommend: 'Giảm bớt tinh bột (cơm, xôi, bánh mì…), các lọai bánh kẹo ngọt, trái cây ngọt.'
      }
    };

    EVALUATE_DETAIL.beo = {
      'less': {
        description: 'Thiếu',
        evaluate: 'Cung cấp thiếu chất béo. Nguy cơ: Thiếu năng lượng, suy dinh dưỡng, thành mạch không bền (xuất huyết thành mạch, xuất huyết não), thiếu vitamin, suy nhược cơ thể, ung thư.',
        recommend: 'Bổ sung dinh dưỡng theo đường uống, kết hợp dùng thêm dầu thực vật trong chế biến món ăn, dùng các lọai cá béo chứa omega 3, các lọai hạt có dầu…'
      },
      'enough': {
        description: 'Đủ',
        evaluate: '',
        recommend: ''
      },
      'over': {
        description: 'Thừa',
        evaluate: 'Chất béo cung cấp vượt nhu cầu khuyến nghị. Nguy cơ: Thừa năng lượng, thừa cân, béo phì, xơ vữa động mạch, tăng mỡ máu, mỡ nội tạng, bệnh tim mạch, nhồi máu não…',
        recommend: 'Hạn chế các chất béo xấu (mỡ động vật, nội tạng, da, nước hầm xương…), thức ăn chứa transfat (thức ăn dùng dầu chiên lại nhiều lần), hạn chế chiên xào, nên ăn thức ăn hấp luộc, hạn chế thức ăn nhanh (fastfood)…'
      }
    };

    var LEVEL = ["less", "enough", "over"];

    var identifyDetailLevel = function (field) {
      var level = LEVEL[0];
      var minValue = calculateStandardKcal($scope.level.nangluong.standardEnergy, STANDARD_DETAIL[field].minValue);
      var maxValue = calculateStandardKcal($scope.level.nangluong.standardEnergy, STANDARD_DETAIL[field].maxValue);

      if ($scope.result.energy[field] < minValue) {
        level = LEVEL[0];
      } else if ($scope.result.energy[field] > maxValue) {
        level = LEVEL[2];
      } else {
        level = LEVEL[1];
      }
      
      //return level;
      return {level: level,
              description: EVALUATE_DETAIL[field][level].description,
              evaluate: EVALUATE_DETAIL[field][level].evaluate, 
              recommend: EVALUATE_DETAIL[field][level].recommend};
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
      return {standardEnergy: standardEnergy, 
              level: level,
              description: EVALUATE_ENERGY[level].description,
              evaluate: EVALUATE_ENERGY[level].evaluate, 
              recommend: EVALUATE_ENERGY[level].recommend};
    };

    function calculateGraphData(actualEnergy, standardEnergyMin, standardEnergyMax) {            
      console.log("actualEnergy = " + actualEnergy + ", standardEnergyMin=" + standardEnergyMin + ", standardEnergyMax=" + standardEnergyMax);

      var rs = [0, 0, 0];
      if (standardEnergyMax === undefined || standardEnergyMax === null) {
        standardEnergyMax = standardEnergyMin;
      }

      if (actualEnergy < standardEnergyMin) { // less
          rs = [actualEnergy, (standardEnergyMin - actualEnergy), 0];
      } else if (actualEnergy > standardEnergyMax) { // more
        rs = [standardEnergyMax, 0, (actualEnergy - standardEnergyMax)];
      } else { // enough
        rs = [actualEnergy, 0, 0];
      }
      return rs;
    };

    function calculateStandardKcal(totalEnergy, percentage) {
      return ((totalEnergy * percentage) / 100);
    }
  
    function rnd(num) {
      var rs = 0;
      if (!isNaN(num) && num != 0) {
        rs = num.toFixed(1);
      }
      return parseFloat(rs);
    }  

    function getNumOfGlasses(actualEnergy, standardEnergy) {
      var num = 1;

      if (standardEnergy - actualEnergy <= 250) {
        num = 1;
      } else if (standardEnergy - actualEnergy <= 500) {
        num = 2;
      } else if (standardEnergy - actualEnergy <= 750) {
        num = 3;
      } else if (standardEnergy - actualEnergy <= 1000) {
        num = 4;
      } else if (standardEnergy - actualEnergy <= 1250) {
        num = 5;
      } else {
        num = 6;
      }
      return new Array(num);
    }

    $scope.customer = NutrientService.getCustomer();
    $scope.menu = NutrientService.getMenu();
    $scope.result = NutrientService.analyseNutrition($scope.menu);
    // identify level
    $scope.level = {};
    
    $scope.level.nangluong = identifyEnergyLevel();
    $scope.numOfGlasses = getNumOfGlasses($scope.result.energy.nangluong, $scope.level.nangluong.standardEnergy);
    $scope.level.dam = identifyDetailLevel('dam');
    $scope.level.duong = identifyDetailLevel('duong');
    $scope.level.beo = identifyDetailLevel('beo');
    
    var enGraphData = calculateGraphData($scope.result.energy.nangluong, 
                                         $scope.level.nangluong.standardEnergy);
    var damGraphData = calculateGraphData($scope.result.energy.dam, 
                                          calculateStandardKcal($scope.level.nangluong.standardEnergy, STANDARD_DETAIL['dam'].minValue), 
                                          calculateStandardKcal($scope.level.nangluong.standardEnergy, STANDARD_DETAIL['dam'].maxValue));
    var duongGraphData = calculateGraphData($scope.result.energy.duong, 
                                            calculateStandardKcal($scope.level.nangluong.standardEnergy, STANDARD_DETAIL['duong'].minValue), 
                                            calculateStandardKcal($scope.level.nangluong.standardEnergy, STANDARD_DETAIL['duong'].maxValue));
    var beoGraphData = calculateGraphData($scope.result.energy.beo, 
                                          calculateStandardKcal($scope.level.nangluong.standardEnergy, STANDARD_DETAIL['beo'].minValue), 
                                          calculateStandardKcal($scope.level.nangluong.standardEnergy, STANDARD_DETAIL['beo'].maxValue));
    // draw graph
    var fillStyle = {
                type: 'linearGradient',
                x0: 0,
                y0: 0,
                x1: 1,
                y1: 0,
                colorStops: [{ offset: 0, color: '#65c2e8' },
                             { offset: 0.49, color: '#55b3e1' },
                             { offset: 0.5, color: '#3ba6dc' },
                             { offset: 1, color: '#2794d4'}]
            };

    $('#divForGraph').jqChart({
                title: { text: '' },
                animation: { duration: 1 },
                shadows: {
                    enabled: true
                },
                axes: [
                         {
                             type: 'category',
                             location: 'bottom',
                             categories: ['Tổng Năng Lượng', 'Đạm', 'Đường', 'Béo']
                         }                         
                      ],
                series: [
                            {
                                type: 'stackedColumn',
                                title: 'Thực Tế',
                                data: [rnd(enGraphData[0]), rnd(damGraphData[0]), rnd(duongGraphData[0]), rnd(beoGraphData[0])],
                                labels: { 
                                  font: '12px sans-serif'
                                }
                            },
                            {
                                type: 'stackedColumn',
                                title: 'Thiếu',
                                data: [rnd(enGraphData[1]), rnd(damGraphData[1]), rnd(duongGraphData[1]), rnd(beoGraphData[1])],
                                labels: { font: '12px sans-serif' }
                            },
                            {
                                type: 'stackedColumn',
                                title: 'Thừa',
                                data: [rnd(enGraphData[2]), rnd(damGraphData[2]), rnd(duongGraphData[2]), rnd(beoGraphData[2])],
                                labels: { font: '12px sans-serif' }
                            }
                        ],
                paletteColors: {
                  type: 'customColors',
                  customColors: ['#00FF00', '#FFFF00', '#FF0000']
                },
                border: {
                    cornerRadius: 20,
                    lineWidth: 0,
                    strokeStyle: '#6ba851'
                },
              fillStyle: fillStyle
              
            });

  });
