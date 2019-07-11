<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => ['auth:api']
        ], function () {
//    Route::get('/user', function (Request $request) {
//        return $request->user();
//    });
    
    //roles
    Route::resource('/roles', 'RoleController');
    Route::get('/roles', 'RoleController@roles');
    Route::get('/roles/{roleId}/permissions', 'RoleController@listPermissions');
    Route::get('/roles/{roleId}/users', 'RoleController@listUsers');
    
    //user-role
    Route::get('/usersroles/del', 'UserRoleController@deleteByRoleAndUserId');
    Route::resource('/usersroles', 'UserRoleController');
    
    //role-permission
    Route::get('/rolespermissions/edit', 'RolePermissionController@editByRoleAndPermissionId');    
    Route::post('/rolespermissions/fillRole/{roleId}', 'RolePermissionController@addPermissionsForNewRole');
    Route::post('/rolespermissions/addToRoles/{permissionId}', 'RolePermissionController@addNewPermissionToRoles');
    Route::resource('/rolespermissions', 'RolePermissionController');
    
    //permissions
    Route::resource('/permissions', 'PermissionController');
    
    //users
    Route::get('/users/avatar/{userId}', 'API\UserController@avatar');
    Route::post('/users/avatar/load/{userId}', 'API\UserController@loadAvatar');
    Route::resource('/users', 'API\UserController');          
    
    //departaments
    Route::get('/departamentstree', 'DepartamentController@buildTree');
    Route::resource('/departaments', 'DepartamentController');           
    //workerslist
    Route::get('/workerslist/{departaments}', 'DepartamentController@workersList');
    Route::get('/workerslist', 'DepartamentController@workersList'); 

    //worker-departament    
    Route::get('/workerdep/del', 'WorkerDepartamentController@deleteRel');
    Route::resource('/workerdep', 'WorkerDepartamentController');    
    
    //Route::get('/departaments/all/{locale}', 'DepartamentController@departaments');    
    //Route::get('/departaments/{id}/{locale}', 'DepartamentController@departaments');  
    
    //tasks groups
    Route::get('/taskgroups/grupytree', 'TaskGroupController@buildTree');    
    Route::resource('/taskgroups', 'TaskGroupController');
    //zlecenia
    Route::get('/zlecenia/list/{grupy}', 'TaskController@listTasks');  
    Route::get('/zlecenia/list', 'TaskController@listTasks');  
    Route::resource('/zlecenia', 'TaskController');  
    
    //product types
    Route::resource('/prodtypes', 'ProductTypeController'); 
    //products
    Route::resource('/products', 'ProductController'); 
    //operations
    Route::resource('/operations', 'OperationController'); 
    //product groups
    Route::get('/prodgroups/grupytree', 'ProductGroupController@buildTree');    
    Route::resource('/prodgroups', 'ProductGroupController');  
    //orders
    Route::get('/orders/history/{orderId}', 'OrderController@history');
    Route::get('/orders/positions/{orderId}', 'OrderController@positions');
    Route::resource('/orders', 'OrderController');
    //orders positions
    //Route::get('/positions/{orderId}', 'OrderController@positions');
    Route::resource('/positions', 'OrderPositionController');  
});

Route::post('login', 'API\UserController@login');
Route::post('register', 'API\UserController@register');
Route::post('/logout', 'Auth\LoginController@logout');


Route::post('/logged', 'Auth\LoginController@isLogged');