angular.module ( 'app.controllers', [] )

  .controller ( 'searchCtrl', function ( $scope, categories, $state, $http, $rootScope, dateService ) {
  $scope.categories = categories;
  $scope.location = '';
  $scope.rating = {};
  $scope.rating.max = 10;
  $scope.readOnly = true;

  setTimeout(function () {
    navigator.splashscreen.hide();
  }, 750);


  $scope.toIntro = function(){
    window.localStorage['didTutorial'] = "false";
    $state.go('intro');
  }

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

  .controller ( 'productCreateCtrl', function ( $scope, $http, categories, $state, productService ) {
    var nowDate = new Date ();
    var dd = nowDate.getDate ();
    var mm = ("0" + (nowDate.getMonth () + 1)).slice ( -2 );
    var yyyy = nowDate.getFullYear ();
    $scope.date = dd + "/" + mm + "/" + yyyy;
    $scope.ownId = '2d78a88e-595f-4a3f-821d-53a52c7f3a38' + Math.floor ( (Math.random () * 100) + 1 );
    $scope.item = {};
    $scope.item.categoryName = categories;
    $scope.scopeState = $state;


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

    $scope.item.id =$scope.generateUUID();

    $scope.saveItem = function () {
      if ($scope.item.location) {
        $scope.item.city = $scope.item.location.address_components['2'].long_name;
        $scope.item.countryCode = $scope.item.location.address_components['5'].short_name;
        $scope.item.postCode = $scope.item.location.address_components['0'].long_name;
      }

      delete $scope.item.location;

      //console.log(JSON.stringify($scope.item));

      $http.post(
        'https://nkmdkkznbh.execute-api.us-west-2.amazonaws.com/integration/product/' + $scope.item.id,
        $scope.item
      ).success(function successCallback(response) {
        productService.setProduct(response);
        $state.go ( 'menu.itemAdded' );
      });
    }

  } )
  .controller ( 'itemAddedCtrl', function ( $scope, $state, productService ) {
    $scope.addedItem = productService.getProduct();
    console.log('itemAddedCtrl : ', $scope.addedItem);

  } )

  .controller ( 'introCtrl', function($scope, $state) {

  // Called to navigate to the main app
    $scope.startApp = function () {
    $state.go ( 'menu.search' );

    // Set a flag that we finished the tutorial
    window.localStorage['didTutorial'] = true;
  };

  //No this is silly
  // Check if the user already did the tutorial and skip it if so
  if (window.localStorage['didTutorial'] === "true") {
    console.log ( 'Skip intro' );
    $scope.startApp ();
  }
  else {
    setTimeout ( function () {
      navigator.splashscreen.hide ();
    }, 750 );
  }


  // Move to the next slide
  $scope.next = function () {
    $scope.$broadcast ( 'slideBox.nextSlide' );
  };

  // Our initial right buttons
  var rightButtons = [
    {
      content: 'Next',
      type: 'button-positive button-clear',
      tap: function ( e ) {
        // Go to the next slide on tap
        $scope.next ();
      }
    }
  ];

  // Our initial left buttons
  var leftButtons = [
    {
      content: 'Skip',
      type: 'button-positive button-clear',
      tap: function ( e ) {
        // Start the app on tap
        $scope.startApp ();
      }
    }
  ];

  // Bind the left and right buttons to the scope
  $scope.leftButtons = leftButtons;
  $scope.rightButtons = rightButtons;


  // Called each time the slide changes
  $scope.slideChanged = function ( index ) {

    // Check if we should update the left buttons
    if (index > 0) {
      // If this is not the first slide, give it a back button
      $scope.leftButtons = [
        {
          content: 'Back',
          type: 'button-positive button-clear',
          tap: function ( e ) {
            // Move to the previous slide
            $scope.$broadcast ( 'slideBox.prevSlide' );
          }
        }
      ];
    } else {
      // This is the first slide, use the default left buttons
      $scope.leftButtons = leftButtons;
    }

    // If this is the last slide, set the right button to
    // move to the app
    if (index == 2) {
      $scope.rightButtons = [
        {
          content: 'Start using MyApp',
          type: 'button-positive button-clear',
          tap: function ( e ) {
            $scope.startApp ();
          }
        }
      ];
    } else {
      // Otherwise, use the default buttons
      $scope.rightButtons = rightButtons;
    }
  }
})

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
 