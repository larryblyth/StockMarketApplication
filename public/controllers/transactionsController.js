// create the controller and inject Angular's $scope


stocktool.controller('transactionsController', function($scope, $http) {

	var accountID = $scope.accountID;
		$http.get("/transactions/" + accountID).success(function(data) {
			$scope.transactions = data;
		});


});