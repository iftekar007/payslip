var CryptoJS = require("crypto-js/aes");




var express = require('express');
var app = express();
var port = process.env.PORT || 1022; 				// set the port
var http = require('http').Server(app);





var bodyParser = require('body-parser');
app.use(bodyParser.json({ parameterLimit: 10000000,
    limit: '90mb'}));
app.use(bodyParser.urlencoded({ parameterLimit: 10000000,
    limit: '90mb', extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        console.log(file.originalname);
        filename=file.originalname.split('.')[0].replace(/ /g,'') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        console.log(filename);
        cb(null, filename);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json


app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



/** API path that will upload the files */
app.post('/uploads', function(req, res) {

    datetimestamp = Date.now();
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,filename:filename});
    });
});

var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/payslipdb';

var MongoClient = mongodb.MongoClient;

app.get('/',function(req,resp){

    console.log('123');
    resp.json({error_code:0,filename:'sdfs sdf'});

});



 app.post('/login', function (req, resp) {

 MongoClient.connect(url, function (err, db) {
 if (err) {
 //   console.log('Unable to connect to the mongoDB server. Error:', err);
 } else {
 //HURRAY!! We are connected. :)
 //  console.log('Connection established to mongo db', url);

 var collection = db.collection('userstable');

 var crypto = require('crypto');

 var secret = req.body.password;
 var hash = crypto.createHmac('sha256', secret)
 .update('password')
 .digest('hex');

 collection.find({email:req.body.email,password:hash}).toArray(function(err, items) {
 resp.send(JSON.stringify(items));
 db.close();
 ///dbresults.push(items);
 });


 //db.close();
 }
 });




 });

app.get('/adminlist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
            //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = db.collection('userstable');

            collection.find().toArray(function(err, items) {
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
                db.close();
            });
        }
    });




});

app.post('/addadmin', function (req, resp) {
    var retstatus = {};
    var addtime=Date.now();
    var role_status=1;

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    value1 = {fname: req.body.fname, lname: req.body.lname, email: req.body.email,password:hash,address:req.body.address,phone_no:req.body.phone_no,mobile_no:req.body.mobile_no,status:1,create_time:req.addtime};
    // console.log("Insert command");


    MongoClient.connect(url, function (err, db) {
        if (err) {
            //      console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            //     console.log('Connection established to mongo db', url);


            var collection = db.collection('userstable');


            collection.insert([value1], function (err, result) {
                if (err) {
                    //       console.log(err);
                    //       console.log('err-----mingo .. vag ');
                    retstatus = {'error':1,'msg':'Failed internal error.'};
                } else {
                    retstatus = {'error':0};
                    //      console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send(JSON.stringify(retstatus));


                    db.close();
                }
            });


        }
    });


});
app.post('/admindetails', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //       console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {

            //      console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('userstable');

            collection.find({_id:o_id}).toArray(function(err, items) {
                resp.send(JSON.stringify(items));
                db.close();

            });

        }
    });

});

app.post('/deleteadmin', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('userstable');
            collection.deleteOne({_id: o_id}, function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else {
                    resp.send("success");
                    db.close();
                }
            });


        }
    });

});

app.post('/adminupdates', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('userstable');
            collection.update({_id: o_id}, {$set: {fname: req.body.fname, lname: req.body.lname, email: req.body.email,address:req.body.address,phone_no:req.body.phone_no,mobile_no:req.body.mobile_no}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else {
                    resp.send("success");
                    db.close();

                }
            });


        }
    });

});

app.post('/adminupdatestatus', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //       console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

            //       console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('userstable');
            collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else {
                    resp.send("success");
                    db.close();

                }
            });


        }
    });

});

app.post('/addpayslip',function(req,resp){
    var retstatus = {};
    var addtime=Date.now();
    value1 = {
        fullname: req.body.fullname,
        company_name: req.body.company_name,
        designation: req.body.designation,
        employee_no:req.body.employee_no,
        location:req.body.location,
        basic:req.body.basic,
        pf_ppf:req.body.pf_ppf,
        chaptersix:req.body.chaptersix,
        hra:req.body.hra,
        employee_esic:req.body.employee_esic,
        conveyanceallowance:req.body.conveyanceallowance,
        professiontax:req.body.professiontax,
        pda:req.body.pda,
        incometax:req.body.incometax,
        booksandperiodicals:req.body.booksandperiodicals,
        lta_deduction:req.body.lta_deduction,
        medical_reimbursement:req.body.medical_reimbursement,
        festive_bonus_deduction:req.body.festive_bonus_deduction,
        child_education_allowance:req.body.child_education_allowance,
        medical_insurance_premium:req.body.medical_insurance_premium,
        special_allowance:req.body.special_allowance,
        other_deduction:req.body.other_deduction,
        entertainment_allowance:req.body.entertainment_allowance,
        misc_deduction:req.body.misc_deduction,
        other_allowance:req.body.other_allowance,
        variable_pay:req.body.variable_pay,
        lta_annual_benefit:req.body.lta_annual_benefit,
        festival_bonus:req.body.festival_bonus,
        medical_insurance_premium_annual_benefit:req.body.medical_insurance_premium_annual_benefit,
        arrear:req.body.arrear,
        payout_month:req.body.payout_month,
        account_number:req.body.account_number,
        earnings:req.body.earnings,
        deductions:req.body.deductions,
        adjustments:req.body.adjustments,
        take_home_pay:req.body.take_home_pay,
        status:1,
        create_time:req.addtime
    };

    MongoClient.connect(url, function (err, db) {
        if (err) {
            //      console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            //     console.log('Connection established to mongo db', url);


            var collection = db.collection('paysliptable');


            collection.insert([value1], function (err, result) {
                if (err) {
                    //       console.log(err);
                    //       console.log('err-----mingo .. vag ');
                    retstatus = {'error':1,'msg':'Failed internal error.'};
                } else {
                    retstatus = {'error':0};
                    //      console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send(JSON.stringify(retstatus));


                    db.close();
                }
            });


        }
    });
});
app.get('/paysliplist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
            //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = db.collection('paysliptable');

            collection.find().toArray(function(err, items) {
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
                db.close();
            });
        }
    });




});

app.post('/deletepayslip', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('paysliptable');
            collection.deleteOne({_id: o_id}, function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else {
                    resp.send("success");
                    db.close();
                }
            });


        }
    });

});

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    //  console.log("Example app listening at http://%s:%s", host, port)

});
