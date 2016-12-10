/*jslint node: true */
/*jslint white:true */
/*global angular */
/*jslint nomen: true*/

'use strict';



// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('dinner', ['ionic', 'ngCordova', 'dinner.controllers','dinner.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading,$cordovaSplashscreen, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      
       /* $timeout(function(){
                $cordovaSplashscreen.hide();
      },2000); */

  });
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        });
    });

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
        console.log('Loading ...');
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    }); 
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/managedishes.html',
            controller: 'DishController'
      }
    }
  })

  .state('app.managedishes', {
      url: '/managedishes',
      views: {
        'mainContent': {
            cache: false,
            templateUrl: 'templates/managedishes.html',
            controller: 'DishController'
        }
      }
    })

   .state('app.adddish', {
      url: '/adddish',
      views: {
        'mainContent': {
          templateUrl: 'templates/adddish.html',
            controller: 'AddDishController'
        }
      }
    })

    .state('app.todaysmenu', {
      url: '/todaysmenu',
      views: {
        'mainContent': {
          cache: false,
          templateUrl: 'templates/todaysmenu.html',
          controller: 'MenuController'
        }
      }
    })
  
  .state('app.cheforders', {
      url: '/cheforders',
      views: {
        'mainContent': {
          templateUrl: 'templates/cheforders.html',
          controller: 'ChefOrderController'
        }
      }
    })

  .state('app.dishdetails', {
    url: '/managedishes/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/dishdetail.html',
        controller: 'DishDetailController'
      }
    }
  })
  .state('app.editdish', {
    url: '/managedishes/:id',
    views: {
      'mainContent': {
        cache: false,  
        templateUrl: 'templates/editdish.html',
        controller: ''
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
