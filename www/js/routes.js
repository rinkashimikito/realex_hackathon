angular.module ( 'app.routes', [] )

  .config ( function ( $stateProvider, $urlRouterProvider ) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


    .state ( 'menu.search', {
    url: '/search',
    views: {
      'side-menu21': {
        templateUrl: 'templates/search.html',
        controller: 'searchCtrl',
        resolve: {
          categories: function(Api) {
            return Api.categories(); }
        }
      }
    }
  } )

    .state ( 'menu.results', {
    url: '/product_list',
    views: {
      'side-menu21': {
        templateUrl: 'templates/results.html',
        controller: 'resultsCtrl'
      }
    }
  } )

    .state ( 'menu.product', {
    url: '/product_item',
    views: {
      'side-menu21': {
        templateUrl: 'templates/product.html',
        controller: 'productCtrl'
      }
    }
  } )

    .state ( 'menu.addItem', {
    url: '/create_product_item',
    views: {
      'side-menu21': {
        templateUrl: 'templates/productCreate.html',
        controller: 'productCreateCtrl',
        resolve: {
          categories: function(Api) {
            return Api.categories(); }
        }
      }
    }
  } )

    .state ( 'menu.itemAdded', {
    url: '/item_added',
    views: {
      'side-menu21': {
        templateUrl: 'templates/itemAdded.html',
        controller: 'itemAddedCtrl'
      }
    }
  } )

    .state ( 'menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract: true
  } )

    .state ( 'menu.aboutUs', {
    url: '/about',
    views: {
      'side-menu21': {
        templateUrl: 'templates/aboutUs.html',
        controller: 'aboutUsCtrl'
      }
    }
  } )

    .state ( 'menu.settings', {
    url: '/settings',
    views: {
      'side-menu21': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  } )

    .state ( 'menu.signup', {
    url: '/signup',
    views: {
      'side-menu21': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }
  } )

    .state ( 'menu.paymentDetails', {
    url: '/payment_details',
    views: {
      'side-menu21': {
        templateUrl: 'templates/paymentDetails.html',
        controller: 'paymentDetailsCtrl'
      }
    }
  } )

    .state ( 'menu.payment', {
    url: '/payment',
    views: {
      'side-menu21': {
        templateUrl: 'templates/payment.html',
        controller: 'paymentCtrl'
      }
    }
  } )

    .state ( 'menu.verification', {
    url: '/verification',
    views: {
      'side-menu21': {
        templateUrl: 'templates/verification.html',
        controller: 'verificationCtrl'
      }
    }
  } )

    .state ( 'menu.rentConfirmation', {
    url: '/confirmation_rent',
    views: {
      'side-menu21': {
        templateUrl: 'templates/rentConfirmation.html',
        controller: 'rentConfirmationCtrl'
      }
    }
  } )

    .state ( 'menu.myRentedItems', {
    url: '/my_rented_items',
    views: {
      'side-menu21': {
        templateUrl: 'templates/my_rented_items.html',
        controller: 'myRentedItemsCtrl'
      }
    }
  } )

    .state ( 'lentConfirmation', {
    url: '/confirmation_lent',
    templateUrl: 'templates/lentConfirmation.html',
    controller: 'lentConfirmationCtrl'
  } )

    .state ( 'menu.almostThere', {
    url: '/rent_verification',
    views: {
      'side-menu21': {
        templateUrl: 'templates/almostThere.html',
        controller: 'almostThereCtrl'
      }
    }
  } )

  $urlRouterProvider.otherwise ( '/side-menu21/search' )


} );