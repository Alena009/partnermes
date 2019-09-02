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
    Route::resource('/clients', 'ClientController');
    Route::get('/components/list/{productId}', 'ComponentController@listComponents');
    Route::resource('/components', 'ComponentController');  
    
    Route::get('/declaredworks/byorderpos/{pos}', 'DeclaredWorkController@listWorksForOrderPos');   
    Route::get('/declaredworks/fortimeline', 'DeclaredWorkController@listWorksForTimeline');   
    Route::get('/declaredworks/list/{groups}', 'DeclaredWorkController@listWorksByGroups');   
    Route::resource('/declaredworks', 'DeclaredWorkController'); 
    
    Route::get('/departaments/grupytree', 'DepartamentController@buildTree');
    Route::resource('/departaments', 'DepartamentController'); 
    
    Route::get('/operations/list/{grupy}', 'OperationController@listOperations');      
    Route::resource('/operations', 'OperationController'); 
    Route::get('/orders/history/{orderId}', 'OrderController@history');
    Route::get('/orders/positions/{orderId}', 'OrderController@positions');
    Route::get('/orders/list/{amount}', 'OrderController@ordersList');
    Route::resource('/orders', 'OrderController');    
    
    Route::resource('/permissions', 'PermissionController');  
    Route::get('/positions/list/freepositions', 'OrderPositionController@freePositionsList');
    Route::resource('/positions', 'OrderPositionController');      
    Route::resource('/prodtypes', 'ProductTypeController'); 
    Route::get('/products/listbygroups/{prodGroups}', 'ProductController@listProductsByProductGroup');  
    Route::get('/products/list/{taskGroups}', 'ProductController@listProductsByTaskGroup'); 
    Route::get('/prodgroups/grupytree', 'ProductGroupController@buildTree');    
    Route::resource('/prodgroups', 'ProductGroupController');     
    Route::resource('/products', 'ProductController');  
    Route::get('/productstasks/list/{productId}', 'ProductTaskController@listTasksByProduct');
    Route::resource('/productstasks', 'ProductTaskController');  
    
    Route::resource('/roles', 'RoleController');
    Route::get('/roles', 'RoleController@roles');
    Route::get('/roles/{roleId}/permissions', 'RoleController@listPermissions');
    Route::get('/roles/{roleId}/users', 'RoleController@listUsers');
    Route::get('/rolespermissions/edit', 'RolePermissionController@editByRoleAndPermissionId');    
    Route::post('/rolespermissions/fillRole/{roleId}', 'RolePermissionController@addPermissionsForNewRole');
    Route::post('/rolespermissions/addToRoles/{permissionId}', 'RolePermissionController@addNewPermissionToRoles');
    Route::resource('/rolespermissions', 'RolePermissionController');    
    
    Route::get('/tasks/listbygroups/{groups?}', 'TaskController@listByGroups');    
    Route::resource('/tasks', 'TaskController');    
    Route::get('/taskgroups/grupytree', 'TaskGroupController@buildTree');    
    Route::resource('/taskgroups', 'TaskGroupController');    
    
    Route::get('/usersroles/del', 'UserRoleController@deleteByRoleAndUserId');
    Route::resource('/usersroles', 'UserRoleController');
    Route::get('/users/avatar/{userId}', 'API\UserController@avatar');
    Route::post('/users/avatar/load/{userId}', 'API\UserController@loadAvatar');
    Route::resource('/users', 'API\UserController');
    
    Route::get('/workerslist/{departaments?}', 'DepartamentController@workersList');
    //Route::get('/workerslist', 'DepartamentController@workersList');     
    Route::get('/workerdep/del', 'WorkerDepartamentController@deleteRel');
    Route::resource('/workerdep', 'WorkerDepartamentController');
    Route::get('/warehouse/amountproduct/{productId}', 'WarehouseController@amountProductInWarehouse');  
    Route::get('/warehouse/list/{grupy?}', 'WarehouseController@listProducts');  
    Route::resource('/warehouse', 'WarehouseController'); 
 
    Route::get('/gantt', 'OperationController@buildGantt');   
});

Route::post('login', 'API\UserController@login');
Route::post('register', 'API\UserController@register');
Route::post('/logout', 'Auth\LoginController@logout');


Route::post('/logged', 'Auth\LoginController@isLogged');