 
 var stocktool = angular.module('stocktool', ['ngRoute']);

 // configure our routes
 stocktool.config(function($routeProvider) {

    console.log("doing stuff here to configure routes!");
     $routeProvider

     // home page
     .when('/', {
         templateUrl: 'views/login.html',
         controller: 'loginController'
     })

     //account view page

     .when('/account/:accountID', {
         templateUrl: 'views/account.html',
         controller: 'accountController'
     })

     .when('/portfolio/:portfolioID', {
         templateUrl: 'views/portfolio.html',
         controller: 'portfolioController'
     })

     .when('/transactions/:accountID', {
         templateUrl: 'views/transactions.html',
         controller: 'transactionsController'
     })

     // make a trade page
     .when('/trade', {
         templateUrl: 'views/trade.html',
         controller: 'tradeController'
     })

    .when('/trade/:accountID', {
         templateUrl: 'views/trade.html',
         controller: 'tradeController'
     })

     // stock screener page
     .when('/industryAnalysis', {
         templateUrl: 'views/industryAnalysis.html',
         controller: 'industryAnalysisController'
     })

     .when('/stockScreener', {
         templateUrl: 'views/stockScreener.html',
         controller: 'stockScreenerController'
     })

     .when('/stockScreener/:betaMin/:betaMax/:quantityMin/:quantityMax', {
         templateUrl: 'views/stockScreener.html',
         controller: 'stockScreenerController'
     })

    .otherwise({
        redirectTo: '/'
      });

 });
 
 stocktool.controller('mainController', function($scope) {
 });