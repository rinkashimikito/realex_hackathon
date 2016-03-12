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
    $http({
      method  : 'GET',
      url     : 'https://nkmdkkznbh.execute-api.us-west-2.amazonaws.com/integration/products/' + item,
      //data    : $.param($scope.formData),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    })
      .success(function(data) {
        console.log('from server : ', data);

        $rootScope.productList = data;
        $state.go('menu.results');

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
      });
  };

  } )

  .controller ( 'productCreateCtrl', function ( $scope ) {

  } )

  .controller ( 'resultsCtrl', function ( $scope, $state, $rootScope, productService ) {
    $scope.goToProduct = function(productId){
      var selectedProduct = $rootScope.productList.filter(function (item) {
        return item.id == productId;
      });

      productService.setProduct(selectedProduct);

      $state.go('menu.product');
    }
  } )

  .controller ( 'productCtrl', function ( $scope, $state, $rootScope, productService ) {
    $scope.selectedProduct = productService.getProduct();

    $scope.askForItem = function(itemId) {
      console.log('productCtrl asking for: ', itemId);
      $state.go('menu.verification');
    }
  } )

  .controller ( 'aboutUsCtrl', function ( $scope ) {

  } )

  .controller ( 'settingsCtrl', function ( $scope ) {

  } )

  .controller ( 'signupCtrl', function ( $scope ) {

  } )

  .controller ( 'paymentDetailsCtrl', function ( $scope ) {

  } )

  .controller ( 'paymentCtrl', function ( $scope ) {

  } )

  .controller ( 'verificationCtrl', function ( $scope ) {

  } )

  .controller ( 'rentConfirmationCtrl', function ( $scope ) {

  } )

  .controller ( 'lentConfirmationCtrl', function ( $scope ) {

  } )

  .controller ( 'almostThereCtrl', function ( $scope ) {

  } )
 