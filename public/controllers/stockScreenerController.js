// create the controller and inject Angular's $scope
stocktool.controller('stockScreenerController', function($scope, $http) {

    $http.get("/stockScreener").success(function(data) {
        $scope.stocks = data;
    });


    $scope.query = function(betamin,quantitymin,betamax,quantitymax) {
        $http.get("/stockScreener/" + betamin + "/"+ betamax + "/" + quantitymin + "/" + quantitymax).success(function(data) {
            $scope.stocks = data;
            console.log(data);
        });
    }
});