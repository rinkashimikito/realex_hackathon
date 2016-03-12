angular.module ( 'app.services', [] )
  .factory ( 'Api', function ( $http, $q ) {
    var categories = [];
    var items = [];

      return {
        categories: function () {
          var dfd = $q.defer ();
          $http.get ( "https://nkmdkkznbh.execute-api.us-west-2.amazonaws.com/integration/categories" ).then ( function ( response ) {
            categories = response.data;
            dfd.resolve ( categories );
          } );
          return dfd.promise;
        },
        items : function ( itemId ) {
          for (var i = 0; i < items.length; i++) {
            if (items[i].id === parseInt ( itemId )) {
              return items[i];
            }
          }
          return null;
        }
      }
  } )

  .service ( 'BlankService', [function () {

  }] );

