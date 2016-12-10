/*jslint node: true */
/*jslint white:true */
/*global angular */
/*jslint nomen: true*/

'use strict';

angular.module('dinner.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$ionicPlatform, $cordovaCamera) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    
  // ****** LOGIN MODAL ******* //    

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
    
// *********** ADD DISH MODAL ************* //

    // Create the add dish modal that we will use later
    $ionicModal.fromTemplateUrl('templates/adddish.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.adddishform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeAdd = function () {
        $scope.adddishform.hide();
    };

    // Open the registration modal
    $scope.addDish = function () {
        $scope.adddishform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.createDish = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
    
     /*$ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        var galleryOptions = {
            maximumImagesCount: 10,
            width: 800,
            height: 800,
            quality: 80
        };
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(galleryOptions).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

        $scope.adddishform.show();

        };
        $scope.openGallery = function() {   
          $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                  for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    $scope.registration.imgSrc = results[i];
                  }
                }, function(error) {
                  // error getting photos
                });
         };
    });   */ 
  
})
.controller('DishController', ['$scope','dishFactory', 'menuFactory' , '$state', 'baseURL', function($scope, dishFactory, menuFactory, $state, baseURL) {
            $scope.baseURL = baseURL; 
            $scope.showDishes = false;
            $scope.message = "Loading ...";
            dishFactory.query(            
                function(response) {
                    $scope.dishes = response;
                    $scope.showDishes = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });
        
            $scope.addToMenu = function(chefid, dishid) {
                console.log('Add to menu %s %s ', chefid, dishid);
                menuFactory.save({chef: chefid, _id: dishid});
                $state.go('app.todaysmenu',{},  {reload: true});
                
            };
        
}])
.controller('DishDetailController', ['$scope','$stateParams','dishFactory', 'menuFactory','$state', 'baseURL', function($scope, $stateParams, dishFactory, menuFactory, $state, baseURL) {
            $scope.baseURL = baseURL; 
            $scope.orderByText = "";
            $scope.showFeedback = true;
            $scope.showAddFeedback = true;
        
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.stars = 5;
        
             dishFactory.get({id:$stateParams.id})
            .$promise.then(
                    function(response){
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
            );
        
        
           $scope.toggleFeedback = function() {
                $scope.showFeedback = !$scope.showFeedback;
            };

            $scope.toggleAddFeedback = function() {
                $scope.showAddFeedback = !$scope.showAddFeedback;
            };
        
            $scope.dishIndex = 0;
        
           $scope.addToMenu = function(chefid, dishid) {
                console.log('Add to menu %s %s ', chefid, dishid);
                menuFactory.save({chef: chefid, _id: dishid});
                $state.go('app.todaysmenu',null, {reload: true});
            };
}])

.controller('EditDishController', ['$scope','$timeout','$stateParams','$window', 'dishFactory', 'Upload', function($scope, $timeout, $stateParams, $window, dishFactory, Upload) {
            $scope.orderByText = "";
            $scope.showFeedback = true;
            $scope.showAddFeedback = true;
        
            $scope.showDish = false;
            $scope.message="Loading ...";
    
             $scope.submit = function() {
              if ($scope.form.dishpic.$valid && $scope.dishpic) {
                $scope.upload($scope.dishpic);
              }
            };

        
            $scope.dish = {};
    
            dishFactory.get({id:$stateParams.id})
            .$promise.then(
                    function(response){
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
            );
    
            $scope.saveChanges = function() {
                console.log($scope.dish.image);
                console.log($scope.dish.image.name);
                if ($scope.dish.image.name !== undefined) {
                     $scope.dish.image = 'assets/img/dishes/' + $scope.dish.image.name;
                } 
               
                dishFactory.update({id:$scope.dish._id}, $scope.dish);
                $window.location.reload();
            };
    
            $scope.editDish = function(file) {
                
                 console.log('first image :: ' + $scope.dish.image.name);
                if ($scope.dish.image.name !== undefined) {
                     //$scope.dish.image = 'assets/img/dishes/' + $scope.dish.image.name;
                     file.upload = Upload.upload({
                      url: 'https://localhost:3443/dishes/upload',
                      data: {file: file}
                    });

                    file.upload.then(function (response) {
                      $timeout(function () {
                        file.result = response.data;
                        console.log('Success ' + response.status + ' : ' + response.data + ' : ' + response.data.filename);
                        $scope.dish.image = './uploads/dishes/' + response.data.filename;
                        console.log('new image :: ' + $scope.dish.image);
                          dishFactory.update({id:$scope.dish._id}, $scope.dish);
                          $window.location.reload();

                      });
                    }, function (response) {
                      if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                          console.log('Success ' + response.status + ' : ' + response.data);
                      }
                    });
                } else {
                    
                    console.log('image not changed');
                    dishFactory.update({id:$scope.dish._id}, $scope.dish);
                    $window.location.reload();
                    
                }
                
               
            };
}])
.controller('AddDishController',['$scope','$timeout', 'dishFactory', 'Upload', function($scope, $timeout, dishFactory, Upload ) {
    $scope.orderByText = "";
    $scope.newDish = {name:"", image: "", cuisine: "", price: "", allergy: "", description: ""};
    
    
     $scope.createDish = function(file) {
        //file = $scope.newDish.image;
         if (file === undefined) {
             $scope.newDish.image  = 'assets/img/dishes/myDish.jpg';
              dishFactory.save($scope.newDish);
              $scope.picFile = "";
                $scope.newDish = {name:"", image: "assets/img/dishes/myDish.jpg", cuisine: "", price: "", allergy: "", description: ""}; 
                $scope.addDishForm.$setPristine(); 
         } else {
            console.log('file is ' + file);
            file.upload = Upload.upload({
              url: 'https://localhost:3443/dishes/upload',
              data: {file: file}
            });

            file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data;
                console.log('Success ' + response.status + ' : ' + response.data + ' : ' + response.data.filename);
                $scope.newDish.image = './uploads/dishes/' + response.data.filename;
                console.log($scope.newDish.description);

                dishFactory.save($scope.newDish);
                  $scope.picFile = "";
                $scope.newDish = {name:"", image: "assets/img/dishes/myDish.jpg", cuisine: "", price: "", allergy: "", description: ""}; 
                $scope.addDishForm.$setPristine(); 
              });
            }, function (response) {
              if (response.status > 0) {
                $scope.errorMsg = response.status + ': ' + response.data;
                  console.log('Success ' + response.status + ' : ' + response.data);
              }
            });
         }

    };
}])

.controller('DinnerHomeController',['$scope','$localStorage', '$window', 'AuthFactory', function($scope, $localStorage, $window, AuthFactory) {
    $scope.orderByText = "";
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.doLogin = function() {
          if($scope.rememberMe) {
           $localStorage.storeObject('userinfo',$scope.loginData);
          }
        AuthFactory.login($scope.loginData);
        $window.location.href = "index.html#/managedishes/";
    };
}])


.controller('HeaderController', ['$scope', '$state', '$rootScope', 'AuthFactory', function ($scope, $state, $rootScope, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        //ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('MenuController', ['$scope','menuFactory', 'dishFactory','favouriteFactory', '$state', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$window',
                               function($scope,  menuFactory, dishFactory, favouriteFactory, $state, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $window) {
        $scope.showItems = false;
        $scope.message = "Loading ...";
        $scope.baseURL = baseURL; 
        //$scope.dishes = {};
        $scope.shouldShowDelete = false;
                                   
    
        menuFactory.query(            
            function(response) {
                $scope.menuItems = response;
                $scope.showItems = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
        });
              
        $scope.removeFromMenu = function(id) {
            $scope.menuid = id;
            console.log("Remove Dish index :: " + $scope.menuid);
            
             $ionicLoading.show({
                template: '<ion-spinner></ion-spinner> Loading...'
            });
            menuFactory.update({_id:id});
             $timeout(function () {
                    $ionicLoading.hide();
                    $window.location.href = "index.html#/todaysmenu.html/";
                }, 1000);
            console.log('Dish removed from menu');
            //$state.go($state.current, null, {reload: true});
        };
                                   
        $scope.doRefresh = function() {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner> Loading...'
            });
             menuFactory.query(            
                function(response) {
                    $scope.menuItems = response;
                    $scope.showItems = true;
                     $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
            });
        };

    
        $scope.addToFavourites = function(id) {
              $scope.dishId = id;
                console.log("Dish index :: " + $scope.dishId);
                
                $scope.favourites = favouriteFactory.getFavourites().query( 
                    function(response) {
                        $scope.favourites = response;
                        console.log("Ids :: " + $scope.favourites.length);
                        if($scope.favourites.length === 0) {
                             dishFactory.get({id:parseInt($scope.dishId,10)})
                                .$promise.then(
                                        function(response){
                                            $scope.dish = response;
                                            console.log("Adding dish.... " + $scope.dish);
                                            $scope.newdish = $scope.dish;
                                            $scope.newdish.dishid = $scope.dish.id;
                                            favouriteFactory.saveDish().save($scope.newdish);
                                        },
                                        function(response) {
                                            $scope.message = "Error: "+response.status + " " + response.statusText;
                                        }
                                );
                        } 
                        else {
                            $scope.addDish = true;
                            angular.forEach($scope.favourites, function(dish, value) {
                                console.log("id :: " + dish.id + " " + value);
                                if($scope.dishId === dish.id ) {
                                    console.log("Matched" + $scope.dishId + " :: " + value  );
                                    $scope.addDish = false;
                                    return;
                                }
                            });
                            if ($scope.addDish) {
                                 dishFactory.get({id:parseInt($scope.dishId,10)})
                                .$promise.then(
                                        function(response){
                                            $scope.dish = response;
                                            console.log("Adding dish.... " + $scope.dish);
                                            favouriteFactory.saveDish().save($scope.dish);
                                        },
                                        function(response) {
                                            $scope.message = "Error: "+response.status + " " + response.statusText;
                                        }
                                );
                            }
                        
                        }
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    });
        };
}])

.controller('ChefOrderController',['$scope','$window','orderFactory', 'baseURL', function($scope, $window,orderFactory, baseURL) {
    $scope.orderByText = "";
    $scope.showOrder = false;
    $scope.message = "Loading ...";
    $scope.baseURL = baseURL;
    
    
    orderFactory.query(            
            function(response) {
                $scope.orders = response;
                $scope.showOrder = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
        });
    
    $scope.updateOrder = function(orderId, order, newStatus) {
        $scope.order = order;
        console.log('order accepted' + orderId + ' ' + $scope.order.status);
        $scope.order.status = newStatus;
        
        orderFactory.update({id:orderId}, $scope.order);
    };
}])

;
