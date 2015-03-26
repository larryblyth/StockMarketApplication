//angular
stocktool.controller('loginController', function($scope, $http, $location) {

    //submit login function
    $scope.submit = function(accountID) {
        
        console.log("ahoy!");

        //console.log($scope.acountID);
        
        $scope.accountID = accountID;

        $http.get("/login/" + accountID).success(function(res) {
            if (res){
                //console.log("In Login controller-> " + res.toSource());
                currentUser = res;
                $location.path("/account/"+ accountID);

            } else {

                alert('YOUUUU SHALLLLLLLL NOTT PASSSS!!!');
            }
        });
    };
});