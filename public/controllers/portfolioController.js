// create the controller and inject Angular's $scope


stocktool.controller('portfolioController', function($scope, $http) {

	var accountID = $scope.accountID;
	$http.get("/portfolio/41").success(function(data) {
		console.log("Listing Portfolio");

		var portfolioID = $scope.portfolioID;

		$http.get("/portfolio/41").success(function(data) {
			$scope.positions = data;
		});
    })

	$scope.tradeStock = function() {
		
		console.log("yarrrr it's a sail!");
		
		var accountID = $scope.accountID;

		// $http.get("/login/" + accountID).success(function(res) {
		// 	if (res) {
		// 		console.log("In Login controller-> " + res.toSource());
		// 		currentUser = res;
		// 		$location.path("/account/"+accountID);

		// 	} else {
		// 		alert('YOUUUU SHALLLLLLLL NOTT PASSSS!!!');
		// 	}
		// });
	}

	$scope.tradeStock = function() {
		
		console.log("drop ye anchorrrr!");
		
	}
});