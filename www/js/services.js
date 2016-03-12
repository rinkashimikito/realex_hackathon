angular.module ( 'app.services', [] )
  .factory ( 'Api', function ( $http, $q ) {
    var categories = [];
    var item = {};

      return {
        categories: function () {
          var dfd = $q.defer ();
          $http.get ( "https://nkmdkkznbh.execute-api.us-west-2.amazonaws.com/integration/categories" ).then ( function ( response ) {
            categories = response.data;
            dfd.resolve ( categories );
          } );
          return dfd.promise;
        },
        item : function ( itemId ) {
          var dfd = $q.defer ();
          $http.get ( "https://nkmdkkznbh.execute-api.us-west-2.amazonaws.com/integration/product" + itemId ).then ( function ( response ) {
            item = response.data;
            dfd.resolve ( item );
          } );
          return dfd.promise;
        }
      }
  } )

  .service('productService', function() {
    var product = {};

    var setProduct = function(newObj) {
      product = newObj;
    };

    var getProduct = function(){
      return product;
    };

    return {
      setProduct: setProduct,
      getProduct: getProduct
    };

  })

  .service('dateService', function() {
    var date = null;

    var setDate = function(newDate) {
      console.log('dateService set: ', newDate);
      date = newDate;
    };

    var getDate = function(){
      console.log('dateService get: ', date);
      return date;
    };

    return {
      setDate: setDate,
      getDate: getDate
    };

  })
