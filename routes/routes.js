// var express = require('express');
// var router = express.Router();

var mysql      = require('mysql');
var connection = require('express-myconnection');

var yahooFinance = require('yahoo-finance');
//var YQL = require('YQL');

var connection = mysql.createConnection({
  host     : 'sql5.freemysqlhosting.net',
  database : 'sql561454',
  user     : 'sql561454',
  password : 'yU1%tS8*',
  port     : '3306'
});

var currentUser = null;


connection.connect();

///////////////////////////Routes//////////////////////////////

module.exports = function (app){

    app.get('/account/:accountID', function(req, res) {

        console.log("looking at this mothers' account " + currentUser.accountID);

        var query = 'SELECT * FROM Account WHERE (accountID = "' + currentUser.accountID + '")';

        connection.query(query, function(err, rows) {
            if (err)
                res.send(err);

            res.json(rows);
               
            });
    });

    app.get('/login/:accountID', function(req, res) {

        console.log("logging in");

        var accountID = req.params.accountID;
        var query = "SELECT * FROM Account WHERE accountID ='" + accountID + "'";
        
        console.log('id: ' + accountID);
        //check if the user is in the database
        connection.query(query, function(err, rows) {
            if(err)
                throw err;
            currentUser = rows[0];
            res.send(currentUser);
        });
    });

    app.get('/portfolio/:portfolioID', function(req, res) {

        console.log("checkin dose trades");



        var portfolioID = req.params.portfolioID;
        var query = 'SELECT PortfolioStock.stockTicker, PortfolioStock.price, PortfolioStock.quantity, PortfolioStock.buyDate, PortfolioStock.industry, PortfolioStock.profLoss '+
        'FROM PortfolioStock INNER JOIN Account ON PortfolioStock.PortfolioID = Account.portfolioID '+
        'WHERE Account.accountID =' + currentUser.accountID;
        
        console.log('portfolio ID: ' + portfolioID);
        //check if the user is in the database
        connection.query(query, function(err, rows) {
            if(err)
                throw err;

            res.json(rows);
        });
    });

    app.get('/transactions/:accountID', function(req, res) {

        console.log("checkin dose trades");

        var accountID = req.params.accountID;
        var query = 'SELECT  TransactionWithStock.transactionID, TransactionWithStock.stockTicker, TransactionWithStock.price, TransactionWithStock.quantity, TransactionWithStock.dateTimeOfTransaction '+
        'FROM TransactionWithStock INNER JOIN Account ON TransactionWithStock.AccountID = Account.accountID '+
        'WHERE Account.accountID =' + currentUser.accountID;
        
        console.log('Account ID: ' + accountID);
        //check if the user is in the database
        connection.query(query, function(err, rows) {
            if(err)
                throw err;

            res.json(rows);
        });
    });

    app.post('/trade/:accountID', function(req, res) {

        console.log("make a trade");

        var currentdate = new Date(); 
        var now = "Last Sync: " + currentdate.getFullYear() + "-"
                + currentdate.getMonth() + "-" 
                + currentdate.getDay() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        var date = new Date();
        var tradeTime = date.toISOString();




        var values = "(dateTimeOfTransaction, quantity, exchangeName, stockTicker, price, currency, fiftyDayMAvg, dayHigh, dayLow, industry, beta, accountID)";

        var post = "INSERT INTO TransactionWithStock " + values + " VALUES (" +
            "'" + tradeTime + "'," +
            "'" + req.body.volume + "'," +
            "'NASDAQ'," +
            "'" + req.body.symbol + "'," +
            "'" + req.body.lastTradePriceOnly + "'," +
            "'USD'," +
            "'" + req.body.changePercentRealtime + "'," +
            "'" + req.body.daysHigh + "'," +
            "'" + req.body.daysLow + "'," +
            "'" + req.body.industry + "'," +
            "'" + req.body.beta + "'," +
            "'" + currentUser.accountID + "')";

            console.log(post);

        //check if the user is in the database
        connection.query(post, function(err, rows) {
            // if (error) 
            //     res.send(err);
            res.json(rows);

            console.log(rows.insertId);
        });

        ///not working wWHHY?? --> works :)
        var update = "UPDATE PortfolioStock SET PortfolioStock.buyDate= '" + tradeTime + 
            "', PortfolioStock.price = '" + req.body.lastTradePriceOnly + 
            "', PortfolioStock.quantity = '" + req.body.volume +
            "' WHERE PortfolioStock.portfolioID = '" + currentUser.portfolioID +
            "' AND PortfolioStock.stockTicker='" + req.body.symbol +"'";

            console.log(update);

        connection.query(update, function(err, rows) {
            // if (error) 
            //     throw err;
            res.json(rows);
            console.log("i'm here");
            //console.log(rows.insertId);
        });

    });

    app.get('/trade', function(req, res) {

        console.log("checkin dose stocks");

        // // var query = 'SELECT  * FROM stock';
        // // console.lof(query);
        var SYMBOLS = [
            "MSFT",
            "LNKD" ,
            "MCD",
            "TSLA",
            "MA",
            "OIL",
            "SBUX",
            "CORN",
            "FOSL"
        ];
        yahooFinance.snapshot({
          fields: ['s', 'l1', 'v', 'g', 'h', 'k2', 'r'],   // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
          symbols: SYMBOLS
        }, function (err, snapshot) {
            if(err)
                console.log(err);
            else{
                console.log(snapshot);
                res.json(snapshot);
            }
        });
        // var query = new YQL('select * from yahoo.finance.historicaldata where symbol = "YHOO" and startDate = "2009-09-11" and endDate = "2009-09-15"')
        // query.exec(function (error, response) {
        // // Do something with results (response.query.results)
        // if(error)
        //     consol.log(error);
        // else
        //     console.log(response.query.results.quote[0]);

    });

    app.get('/industryAnalysis', function(req, res) {

        console.log("layin dat screen on dose Stocks!");

        var query = 'SELECT PortfolioStock.industry, SUM(PortfolioStock.quantity) AS totalVolume, AVG(PortfolioStock.beta) AS avgBeta FROM PortfolioStock INNER JOIN stock ON PortfolioStock.stockTicker = stock.stockTicker GROUP BY industry ORDER BY totalVolume;';
        
        //check if the user is in the database
        connection.query(query, function(err, rows) {
            if(err)
                throw err;
            console.log(rows);
            res.json(rows);
        });
    });

    app.get('/update/:accountID', function(req, res) {

        console.log("renewing friends");

        var query = "SELECT * FROM Account where Account.accountID = '" + currentUser.accountID;



        connection.query(query, function(error) {
            // if (error) {

            //     console.log(error.message);
            // } else {

                console.log('postinnng up');

        });
    });

    app.post('/update/:accountID', function(req, res) {

        console.log("renewing friends");

        var update = "UPDATE Account SET Account.firstName= '" + req.body.firstName + 
            "', Account.address = '" + req.body.address + 
            "', Account.accountBalance = " + req.body.accountBalance +
            "', Account.contactNumber = '" + req.body.contactNumber +    
            "', Account.email = '" + req.body.email +         
            "' WHERE Account.accountID = '" + currentUser.accountID +"'";

            console.log(update);

        connection.query(update, function(error) {
            // if (error) {

            //     console.log(error.message);
            // } else {

                console.log('postinnng up');

        });
    });

    ///the following is in order to save a search:

    app.get('/stockScreener', function(req, res) {
        //on trade page, add button 'save search'
        //save search

        var SYMBOLS = [
            "MSFT",
            "LNKD" ,
            "MCD",
            "TSLA",
            "MA",
            "OIL",
            "SBUX",
            "CORN",
            "FOSL"
        ];

        yahooFinance.snapshot({
          fields: ['s', 'l1', 'v', 'g', 'h', 'k2', 'r','as'],   // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
          symbols: SYMBOLS
        }, function (err, snapshot) {
            if(err)
                console.log(err);
            else{

                var count = Object.keys(snapshot).length
                console.log(count);
                console.log(snapshot[0].lastTradePriceOnly);
                // var key, count;

                for(var i = 0; i< count; i++){

                    var update = "UPDATE stock SET stock.beta= '" + snapshot[i].peRatio + 
                    "', stock.price = '" + snapshot[i].lastTradePriceOnly + 
                    "', stock.quantity = '" + snapshot[i].volume +
                    "', stock.dayHigh = '" + snapshot[i].daysHigh +
                    "', stock.dayLow = '" + snapshot[i].daysLow +
                    "', stock.fiftyDayMAvg = '" + snapshot[i].changePercentRealtime +
                    "' WHERE stock.stockTicker = '" + snapshot[i].symbol +"';";

                    console.log(update);

                    connection.query(update, function(err, rows) {
                        if (err) 
                            throw err;
                        //res.json(rows);
                        console.log(rows);
                        //console.log(rows.insertId);
                    });
                }
                //console.log(count);
            }
        });

        console.log("looook at all dem stocks before u screen");

        var query = "SELECT * from stock";
        
        connection.query(query, function(err, rows) {
            if(err)
                throw err;
            res.json(rows);
        });
    });

    app.get('/stockScreener/:betaMin/:betaMax/:quantityMin/:quantityMax', function(req, res) {
        //query stocks - to be added to trade page
        console.log("checkin dat portfolio");

        var peRatioMin = req.params.betaMin;
        var peRatioMax = req.params.betaMax;  
        var quantityMin = req.params.quantityMin;
        var quantityMax = req.params.quantityMax;        

        var query = "SELECT stock.stockTicker, stock.price, stock.quantity, stock.fiftyDayMAvg, stock.dayHigh, stock.dayLow, stock.beta FROM stock WHERE" +
                        " stock.beta > "+peRatioMin+
                        " AND stock.beta < "+peRatioMax+
                        " AND stock.quantity > "+quantityMin+
                        " AND stock.quantity < "+quantityMax+";";
        
        console.log('searching on dat hoedem');



        console.log(query);
        
        connection.query(query, function(err, rows) {
                if(err)
                    throw err;

                res.json(rows);
                console.log(rows);
            });
    });


}
