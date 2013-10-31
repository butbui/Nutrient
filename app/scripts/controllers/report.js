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
        evaluate: 'Tổng năng lượng thấp hơn mức năng lượng nhu cầu theo khuyến nghị.',
        recommend: 'Bổ sung dinh dưỡng theo đường uống với sữa đầy đủ và cân đối, đạm chất lượng cao, đầy đủ vitamin và khoáng chất, kết hợp chế độ ăn đa dạng các loại thực phẩm.'
      },
      'enough': {
        description: 'Đủ',
        evaluate: 'Đạt mức năng lượng nhu cầu theo khuyến nghị',
        recommend: 'Cần áp dụng chế độ dinh dưỡng hợp lý gồm đầy đủ, đa dạng các lọai thực phẩm, đảm bảo 4 nhóm thực phẩm chính(đạm, đường, béo, vitamin), kết hợp uống bồ sung 1- 2 ly sữa /ngày.'
      },
      'over': {
        description: 'Thừa',
        evaluate: 'Tổng năng lượng cao hơn mức năng lượng nhu cầu theo khuyến nghị.',
        recommend: 'Bớt ăn các món nhiều tinh bột (cơm, bánh mì…), bớt mỡ, đường, thịt, không ăn vặt, ăn đêm, tăng cường vận động, hạn chế rượu bia.'
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

    function loadChart() {
      var chart1 = new cfx.Chart();
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
      
      chart1.getAnimations().getLoad().setEnabled(true);
      chart1.setGallery(cfx.Gallery.Bar);
      chart1.getToolTips().setEnabled(false);
    
      var data = chart1.getData();

      chart1.getData().setSeries(3);

      // draw graph
      var arrayOfData = new Array(
          enGraphData,
          damGraphData,
          duongGraphData,
          beoGraphData
      );

      for (var i = 0; i <= 3; i++) {
        // thuc te
        data.setItem(0, i, (arrayOfData[i][0]));
        // thieu
        if (arrayOfData[i][1] > 0) {
          data.setItem(1, i, (arrayOfData[i][1]));
        }
        // thua
        if (arrayOfData[i][2] > 0) {
          data.setItem(2, i, (arrayOfData[i][2]));  
        }  
      }

      chart1.getSeries().getItem(0).setColor('#108F1A'); // thuc te (xanh)
      chart1.getSeries().getItem(0).setText("Thực Tế");

      chart1.getSeries().getItem(1).setColor('#FFF035'); // thieu (vang)
      chart1.getSeries().getItem(1).setText("Thiếu");

      chart1.getSeries().getItem(2).setColor('#E83A3B'); // thua (do)
      chart1.getSeries().getItem(2).setText("Thừa");      

      var axis;
      axis = chart1.getAxisX();
      axis.getLabels().setItem(0, "Tổng NL");
      axis.getLabels().setItem(1, "Đạm");
      axis.getLabels().setItem(2, "Đường");
      axis.getLabels().setItem(3, "Béo");

      chart1.getAllSeries().getPointLabels().setVisible(true);
      chart1.getAllSeries().setStacked(cfx.Stacked.Normal);
      chart1.getAllSeries().setBarShape(cfx.BarShape.Cylinder);
      chart1.getAllSeries().setVolume(50);
      chart1.getView3D().setEnabled(true);
      chart1.getView3D().setAngleX(20);
      chart1.getView3D().setAngleY(0);
      
      // set max
      if ($scope.result.energy.nangluong > $scope.level.nangluong.standardEnergy) {
        chart1.getAxisY().setMax($scope.result.energy.nangluong + 500);
      } else {
        chart1.getAxisY().setMax($scope.level.nangluong.standardEnergy + 500);
      }

      chart1.getLegendBox().setDock(cfx.DockArea.Right);

      var chartDiv = document.getElementById('divForGraph');
      chart1.create(chartDiv);
      $('svg#C1s g').remove();
    };

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
    
    loadChart();

  });
