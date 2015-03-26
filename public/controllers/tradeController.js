// create the controller and inject Angular's $scope
stocktool.controller('tradeController', function($scope, $http) {

        $http.get("/trade").success(function(data) {
            $scope.stocks = data;
        });

	$scope.buy = function(stock) {

        var stock = {
            symbol: stock.symbol,
            lastTradePriceOnly: stock.lastTradePriceOnly,
            volume: stock.volume,
            exchangeName: 'NASDAQ',
            currency: stock.currency,
            fiftyDayMAvg: stock.changePercentRealtime,
            dayHigh: stock.daysHigh,
            dayLow: stock.daysLow,
            industry: 'Tech',
            beta: 1
        }
        
        console.log("Yarr weeee be making saailss!... get it? Yes Morg.");
        
        var accountID = $scope.accountID;

        $http.post("/trade/" + accountID, stock).success(function(res, req) {
            if (res) {
                alert("Your Transaction is Filled!");
            } 
        });
    }

});

