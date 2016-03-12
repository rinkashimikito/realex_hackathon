angular.module ( 'app.controllers', [] )

  .controller ( 'searchCtrl', function ( $scope, categories, $state, $http, $rootScope, dateService ) {
  $scope.categories = categories;
  $scope.location = '';
  $scope.rating = {};
  $scope.rating.max = 10;
  $scope.readOnly = true;

  //$scope.submitSearch = function ( item, startDate, endDate, location ) {
  //  console.log ( item, startDate, endDate, location );
  //  //$rootScope.result
  //  $state.go ( 'menu.results' );
  //}

  $scope.submitSearch = function ( item, startDate, endDate, location ) {
    if (startDate && endDate) {
      var day = 24*60*60*1000;
      var numDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(day)));
      dateService.setDate(numDays);

    } else {
      dateService.setDate('1');
    }

    $http ( {
      method: 'GET',
      url: 'https://nkmdkkznbh.execute-api.us-west-2.amazonaws.com/integration/products/' + item,
      //data    : $.param($scope.formData),  // pass in data as strings
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
    } )
      .success ( function ( data ) {
        console.log ( 'from server : ', data );

        $rootScope.productList = data;
        $state.go ( 'menu.results' );

        // TODO add response validation
        //if (!data.success) {
        //  // if not successful, bind errors to error variables
        //  $scope.errorName = data.errors.name;
        //  $scope.errorSuperhero = data.errors.superheroAlias;
        //} else {
        //  // if successful, bind success message to message
        //  $rootScope.productList = data;
        //  $state.go('menu.results');
        //}
      } );
  };

} )

  .controller ( 'productCreateCtrl', function ( $scope, $http, categories, $ionicHistory ) {
    var nowDate = new Date ();
    var dd = nowDate.getDate ();
    var mm = ("0" + (nowDate.getMonth () + 1)).slice ( -2 );
    var yyyy = nowDate.getFullYear ();
    $scope.date = dd + "/" + mm + "/" + yyyy;
    $scope.ownId = '2d78a88e-595f-4a3f-821d-53a52c7f3a38' + Math.floor ( (Math.random () * 100) + 1 );
    $scope.item = {};
    $scope.item.categoryName = categories;


    $scope.generateUUID = function (){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
        d += performance.now();
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    };

    $scope.id =$scope.generateUUID();

    $scope.saveItem = function () {
      if ($scope.item.location.address_components) {
        $scope.item.city = $scope.item.location.address_components['2'].long_name;
        $scope.item.countryCode = $scope.item.location.address_components['5'].short_name;
        $scope.item.postCode = $scope.item.location.address_components['0'].long_name;
      }

      delete $scope.item.location;

      console.log(JSON.stringify($scope.item));

      $http({
        method: 'PUT',
        url: 'https://nkmdkkznbh.execute-api.us-west-2.amazonaws.com/integration/product/' + $scope.item.id,
        data: $scope.item
      }).then(function successCallback(response) {
        console.log('productCreateCtrl added');
        $ionicHistory.clearHistory();
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        console.log('productCreateCtrl fcuked');
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }

} )

  .controller ( 'resultsCtrl', function ( $scope, $state, $rootScope, productService ) {
  $scope.goToProduct = function ( productId ) {
    var selectedProduct = $rootScope.productList.filter ( function ( item ) {
      return item.id == productId;
    } );

    productService.setProduct ( selectedProduct );

    $state.go ( 'menu.product' );
  }
} )


  .controller ( 'productCtrl', ['$scope', '$ionicModal', '$ionicSlideBoxDelegate', '$state', '$rootScope', 'productService','dateService', function ($scope, $ionicModal, $ionicSlideBoxDelegate, $state, $rootScope, productService, dateService ) {
    $scope.selectedProduct = productService.getProduct ();
    $scope.numberOfDays = dateService.getDate() || 1;

  console.log('productCtrl numberOfDays:', $scope.numberOfDays, $scope.selectedProduct);
  console.log('productCtral images :', $scope.selectedProduct['0'].images);

    $scope.aImages = $scope.selectedProduct['0'].images;

    $ionicModal.fromTemplateUrl ( 'image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    } ).then ( function ( modal ) {
      $scope.modal = modal;
    } );

    $scope.openModal = function () {
      $ionicSlideBoxDelegate.slide ( 0 );
      $scope.modal.show ();
    };

    $scope.closeModal = function () {
      $scope.modal.hide ();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on ( '$destroy', function () {
      $scope.modal.remove ();
    } );
    // Execute action on hide modal
    $scope.$on ( 'modal.hide', function () {
      // Execute action
    } );
    // Execute action on remove modal
    $scope.$on ( 'modal.removed', function () {
      // Execute action
    } );
    $scope.$on ( 'modal.shown', function () {
      console.log ( 'Modal is shown!' );
    } );

    // Call this functions if you need to manually control the slides
    $scope.next = function () {
      $ionicSlideBoxDelegate.next ();
    };

    $scope.previous = function () {
      $ionicSlideBoxDelegate.previous ();
    };

    $scope.goToSlide = function ( index ) {
      $scope.modal.show ();
      $ionicSlideBoxDelegate.slide ( index );
    }

    // Called each time the slide changes
    $scope.slideChanged = function ( index ) {
      $scope.slideIndex = index;
    };

    $scope.askForItem = function ( itemId ) {
      console.log ( 'productCtrl asking for: ', itemId );
      $state.go ( 'menu.verification' );
    }
}] )

  .controller ( 'aboutUsCtrl', function ( $scope ) {

} )

  .controller ( 'settingsCtrl', function ( $scope ) {

} )

  .controller ( 'signupCtrl', function ( $scope ) {

} )

  .controller ( 'paymentDetailsCtrl', function ( $scope ) {

} )
//  .controller ( 'productCtrl', ['$scope', '$ionicModal', '$ionicSlideBoxDelegate', '$state', '$rootScope', 'productService','dateService', function ($scope, $ionicModal, $ionicSlideBoxDelegate, $state, $rootScope, productService, dateService ) {
//  $scope.selectedProduct = productService.getProduct ();
//
//
//  console.log('productCtrl numberOfDays:', $scope.numberOfDays, $scope.selectedProduct);
//
//  $scope.askForItem = function ( itemId ) {
//    console.log ( 'productCtrl asking for: ', itemId );
//    $state.go ( 'menu.verification' );
//  }
//}] )

  .controller ( 'paymentCtrl', ['$scope', '$ionicModal', '$ionicSlideBoxDelegate', '$state', '$rootScope', 'productService','$http', 'dateService', function ($scope, $ionicModal, $ionicSlideBoxDelegate, $state, $rootScope, productService, $http, dateService ) {
  $scope.selectedProduct = productService.getProduct ();
  $scope.numberOfDays = dateService.getDate() || 1;
  console.log('paymentCtrl selectedProduct:', $scope.selectedProduct);

    $http.get('https://nkmdkkznbh.execute-api.us-west-2.amazonaws.com/integration/bookings/GBP/110').
      success(function(jsonFromServerSdk, status, headers, config) {
        //$scope.posts = data;
        var jsonFromRealex = JSON.parse(jsonFromServerSdk.realexJson);
        RealexHpp.setHppUrl('https://hpp.sandbox.realexpayments.com/pay');
        RealexHpp.init("myPaymentButton", "http://moodnode.com/testPost.php", jsonFromRealex);
      }).
      error(function(data, status, headers, config) {
        // log error
      });

} ])

  .controller ( 'verificationCtrl', function ( $scope ) {

} )

  .controller ( 'rentConfirmationCtrl', function ( $scope ) {

} )

  .controller ( 'lentConfirmationCtrl', function ( $scope ) {

} )

  .controller ( 'almostThereCtrl', function ( $scope ) {

} )

  .controller ( 'myRentedItemsCtrl', function ( $scope ) {

} )
 