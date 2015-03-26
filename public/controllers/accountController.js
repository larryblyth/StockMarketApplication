// create the controller and inject Angular's $scope
var accountID;
var currentUser;
stocktool.controller('accountController', function($scope, $http) {


    //get the account info for the currently logged in user
    accountID = $scope.accountID
    console.log(accountID);

    $http.get("/account/" + accountID).success(function(data) {
        //accountID = data.accountID;
        //console.log($scope.firstName);
        console.log(accountID);
        
        $scope.firstName = data[0].firstName;
        $scope.accountID = data[0].accountID;
        $scope.email = data[0].email;
        $scope.address = data[0].address;
        $scope.accountBalance = data[0].accountBalance;

    })
});
