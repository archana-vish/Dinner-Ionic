/*jslint node: true */
/*jslint white:true */
/*global angular */
// Fetching data from server - localhost which is the json server now
'use strict';

angular
.module('dinner.services',['ngResource'])
.constant("baseURL","http://192.168.0.6:3000/") // <- to connect to express and mongodb for emulator
//.constant("baseURL","https://localhost:3443/") //<- to connect to rest and mongodb
.factory('dishFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "dishes/:id", {id:"@Id"}, {
            'update': {
                method: 'PUT'
            }
        });
}])

.factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL){
     return $resource(baseURL+"menu/:id", {id:"@Id"}, {
         'update': { 
             method:'PUT' 
         },
          'query':  {method:'GET', isArray:true}
     });
    
    
}])

.factory('orderFactory', ['$resource', 'baseURL', function($resource,baseURL){
    return $resource(baseURL+"orders/:id", {id:"@Id"}, {
         'update': { 
             method:'PUT' 
         },
          'query':  {method:'GET', isArray:true}
     });
}])
.factory('favouriteFactory', ['$resource', 'baseURL', function($resource,baseURL){
    
        return $resource(baseURL+"favourites/:id",{id: "@Id"}, {
          'update': { 
             method:'PUT' 
         },
          'query':  {method:'GET', isArray:true}
        });
}])
;