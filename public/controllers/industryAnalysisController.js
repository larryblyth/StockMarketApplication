// create the controller and inject Angular's $scope
stocktool.controller('industryAnalysisController', function($scope, $http) {

    console.log('in industryAnalysisController');


	$scope.volume = function() {
			$http.get("/industryAnalysis").success(function(data){
        $scope.stocks = data;
	})

	// $http.get("/stockScreener/volume").success(function(data){
 //        $scope.stocks = data;
	// }
}
});