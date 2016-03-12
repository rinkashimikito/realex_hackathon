angular.module ( 'app.controllers', [] )

  .controller ( 'searchCtrl', function ( $scope, categories, $state, $http, $rootScope ) {
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

  .controller ( 'productCreateCtrl', function ( $scope ) {

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


  .controller ( 'productCtrl', ['$scope', '$ionicModal', '$ionicSlideBoxDelegate', '$state', '$rootScope', 'productService', function ($scope, $ionicModal, $ionicSlideBoxDelegate, $state, $rootScope, productService ) {
    $scope.selectedProduct = productService.getProduct ();
    $scope.aImages = [{
      'src': 'http://ionicframework.com/img/ionic-logo-blog.png',
      'msg': 'Swipe me to the left. Tap/click to close'
    }, {
      'src': 'http://ionicframework.com/img/ionic_logo.svg',
      'msg': ''
    }, {
      'src': 'http://ionicframework.com/img/homepage/phones-weather-demo@2x.png',
      'msg': ''
    }];

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

  .controller ( 'paymentCtrl', function ( $scope, $http ) {
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

} )

  .controller ( 'verificationCtrl', function ( $scope ) {

} )

  .controller ( 'rentConfirmationCtrl', function ( $scope ) {

} )

  .controller ( 'lentConfirmationCtrl', function ( $scope ) {

} )

  .controller ( 'almostThereCtrl', function ( $scope ) {

} )
 