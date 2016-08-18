// JavaScript Document



//['ui.router','angularValidator','ngDialog']



var payslipvar =  angular.module('payslip',['ui.router','angularValidator','ngCookies','ui.bootstrap']);



payslipvar.filter('startFrom', function () {

    return function (input, start) {

        if (input) {

            start = +start;

            return input.slice(start);

        }

        return [];

    };

});



payslipvar.config(function($stateProvider, $urlRouterProvider,$locationProvider) {

						   

	// return page 					   

	$urlRouterProvider

        .otherwise("/login");

		  //.otherwise("/angular_js_basic/index");					   

						   

	$stateProvider

	.state('index',{

            url:"/index",

            views: {

				  'header': {

                    templateUrl: 'partials/header.html' ,

                    //controller: 'header'

                },

				

                'contain': {

                    templateUrl: 'partials/index.html' ,

                    //controller: 'contain'

                },

                'footer': {

                    templateUrl: 'partials/footer.html' ,

                    //controller: 'footer'

                },

				



            }

        }

    )

        .state('add-admin,',{

            url:"/add-admin",

            views:{

                'header':{

                   templateUrl:'partials/header.html',

                    controller:'header'

                },

                'contain':{

                    templateUrl:'partials/add_admin.html',

                    controller:'addadmin'

                },

                'footer':{

                    templateUrl:'partials/footer.html',

                    controller:'header'

                }

            }

        })

        .state('admin-list',{

          url:"/admin-list",

            views:{

                'header':{

                    templateUrl:'partials/header.html',

                  //  controller:'header'

                },

                'contain':{

                    templateUrl:'partials/admin_list.html',

                    controller:'adminlist'

                },

                'footer':{

                    templateUrl:'partials/footer.html',

                 //  controller:'header'

                }

            }

        })

        .state('login',{

            url:"/login",

            views:{

                'header':{

                    templateUrl:'partials/header.html',

                  //  controller:'header'

                },

                'contain':{

                    templateUrl:'partials/login.html',

                    controller:'login'

                },

                'footer':{

                    templateUrl:'partials/footer.html',

                   // controller:'header'

                }

            }

        })

	.state('add-payslip',{

            url:"/add-payslip",

            views: {

				  'header': {

                    templateUrl: 'partials/header.html' ,

                    //controller: 'header'

                },

				

                'contain': {

                    templateUrl: 'partials/form.html' ,

                    controller: 'addpayslip'

                },

                'footer': {

                    templateUrl: 'partials/footer.html' ,

                    //controller: 'footer'

                },

				



            }

        }

    )	.state('payslip-list',{

            url:"/payslip-list",

            views: {

				  'header': {

                    templateUrl: 'partials/header.html' ,

                    //controller: 'header'

                },



                'contain': {

                    templateUrl: 'partials/payslip_list.html' ,

                    controller: 'paysliplist'

                },

                'footer': {

                    templateUrl: 'partials/footer.html' ,

                    //controller: 'footer'

                },





            }

        }

    )

	

	



	

	



	

	

	// blank page 	

	 $locationProvider.html5Mode({

        enabled: true,

        requireBase: false,

        hashPrefix:'!'

    });

	

	

});

payslipvar.controller('header',function($scope,$state,$http,$cookieStore,$rootScope,$window){



})

payslipvar.controller('addadmin',function($scope,$state,$http,$cookieStore,$rootScope,$window){

    $scope.submitadminForm = function(){

        $http({

            method  : 'POST',

            async:   false,

            url     : $scope.adminUrl+'addadmin',

            data    : $.param($scope.form),  // pass in data as strings

            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

        }) .success(function(data) {

            //$rootScope.stateIsLoading = false;

            if(data.status == 'error'){

                console.log(data);

                $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');

            }else{

                $state.go('admin-list');

                return;

            }







        });





    }

})
payslipvar.controller('adminlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window) {

    $scope.predicate = '_id';

    $scope.reverse = true;

    $scope.order = function(predicate) {

        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;

        $scope.predicate = predicate;

    };

    $scope.currentPage=1;

    $scope.perPage=10;



    $scope.totalItems = 0;



    $scope.filterResult = [];

    $http({

        method  : 'GET',

        async:   false,

        url     : $scope.adminUrl+'adminlist',

        // data    : $.param($scope.form),  // pass in data as strings

        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

    }) .success(function(data) {

        $rootScope.stateIsLoading = false;

        // console.log(data);

        $scope.userlist=data;

        console.log($scope.userlist);

        // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));





    });



    $scope.searchkey = '';

    $scope.search = function(item){



        if ( (item.fname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.lname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.email.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.mobile_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.phone_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.address.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){

            return true;

        }

        return false;

    };



    $scope.deladmin = function(item,size){



        $scope.currentindex=$scope.userlist.indexOf(item);



        $uibModal.open({

            animation: true,

            templateUrl: 'admindelconfirm.html',

            controller: 'ModalInstanceCtrl',

            size: size,

            scope:$scope

        });

    }



    $scope.changeStatus = function(item){

        $rootScope.stateIsLoading = true;

        var idx = $scope.userlist.indexOf(item);

        if($scope.userlist[idx].status==1){

            $scope.status=0;

        }

        else{

            $scope.status=1;

        }

        $http({

            method  : 'POST',

            async:   false,

            url     : $scope.adminUrl+'adminupdatestatus',

            data    : $.param({id: $scope.userlist[idx]._id,status:$scope.status}),  // pass in data as strings

            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

        }) .success(function(data) {

            $rootScope.stateIsLoading = false;

            if($scope.userlist[idx].status == 0){

                $scope.userlist[idx].status = 1;

            }else{

                $scope.userlist[idx].status = 0;

            }

            // $scope.userlist[idx].status = !$scope.userlist[idx].status;

        });

    }









    //console.log('in add admin form ');

});

payslipvar.controller('login', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window) {

    $scope.errormsg='';

    $scope.submitLogin=function(){

        $http({

            method  : 'POST',

            async:   false,

            url     : $scope.adminUrl+'login',

            data    : $.param($scope.form),  // pass in data as strings

            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

        }) .success(function(data) {

            $rootScope.stateIsLoading = false;

           if(data.length>0){

               $state.go('admin-list');

           }

           else{

            $scope.errormsg='Invalid User Name / Password';

           }



        });

    }











    //console.log('in add admin form ');

});

payslipvar.controller('addpayslip',function($scope,$state,$http,$cookieStore,$rootScope,$window){
    $scope.form = {
        payout_month:''
    }

    $scope.format = 'MM/dd/yyyy';

    $scope.setDate1 = function(){
        if(typeof($scope.form.payout_month) != 'undefined'){
            $scope.maxDate = new Date($scope.form.payout_month);
        }
    }


    $scope.open11 = function() {
        $scope.opened1 = true;
    };


    $scope.payslipform2 = function(){
      console.log($scope.form);


        $http({

            method  : 'POST',

            async:   false,

            url     : $scope.adminUrl+'addpayslip',

            data    : $.param($scope.form),  // pass in data as strings

            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

        }) .success(function(data) {




        });





    }

})

payslipvar.controller('paysliplist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window) {

    $scope.predicate = '_id';

    $scope.reverse = true;

    $scope.order = function(predicate) {

        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;

        $scope.predicate = predicate;

    };

    $scope.currentPage=1;

    $scope.perPage=10;



    $scope.totalItems = 0;



    $scope.filterResult = [];

    $http({

        method  : 'GET',

        async:   false,

        url     : $scope.adminUrl+'paysliplist',

        // data    : $.param($scope.form),  // pass in data as strings

        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

    }) .success(function(data) {

        $rootScope.stateIsLoading = false;

        // console.log(data);

        $scope.paysliplist=data;

        // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));





    });



    $scope.searchkey = '';

 /*   $scope.search = function(item){



        if ( (item.fname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.lname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.email.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.mobile_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.phone_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.address.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){

            return true;

        }

        return false;

    };*/



    $scope.delpayslip = function(item,size){



        $scope.currentindex=$scope.paysliplist.indexOf(item);



        $uibModal.open({

            animation: true,

            templateUrl: 'payslipdelconfirm.html',

            controller: 'ModalInstanceCtrl',

            size: size,

            scope:$scope

        });

    }



  });
payslipvar.controller('ModalInstanceCtrl', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,$uibModal,$timeout) {
    $scope.cancel=function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.confirmdeladmin = function(){
        $uibModalInstance.dismiss('cancel');

        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deleteadmin',
            data    : $.param({id: $scope.userlist[idx]._id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data=='success'){
                $scope.userlist.splice(idx,1);
            }

            // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }
    $scope.confirmdelpayslip = function(){
        $uibModalInstance.dismiss('cancel');

        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletepayslip',
            data    : $.param({id: $scope.paysliplist[idx]._id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data=='success'){
                $scope.paysliplist.splice(idx,1);
            }

            // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }

});