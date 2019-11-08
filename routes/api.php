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
    
    Route::resource('/clients',    'ClientController');         
    Route::resource('/components', 'ComponentController');  
    Route::resource('/country',    'CountryController');
    Route::resource('/language',   'LanguageController');
    Route::resource('/permissions','PermissionController');
    Route::resource('/statuses', 'StatusController');   
    Route::resource('/prodtypes', 'ProductTypeController');       
    Route::resource('/history', 'OrderHistoryController');    
      
    Route::get('/declaredworks/savework', 'DeclaredWorkController@savework'); 
    Route::resource('/declaredworks', 'DeclaredWorkController'); 
    
    Route::get('/departaments/scheduler', 'DepartamentController@buildScheduler');
    Route::get('/departaments/grupytree', 'DepartamentController@buildTree');
    Route::resource('/departaments', 'DepartamentController'); 
    
    Route::get('/operations/save', 'OperationController@save');      
    Route::get('/operations/taskchange', 'OperationController@taskchange');      
    Route::get('/operations/list/{grupy}', 'OperationController@listOperations');      
    Route::resource('/operations', 'OperationController'); 

    Route::get('/orders/history/{orderId}', 'OrderController@history');
    Route::resource('/orders', 'OrderController');    
    

    
    Route::get('/positions/byorder/{order}', 'OrderPositionController@getPositionsByOrder');    
    Route::get('/positions/forprod', 'OrderPositionController@forManufacturing');    
    Route::get('/positions/forzlec', 'OrderPositionController@forZlecenia');    
    Route::get('/positions/list/components', 'OrderPositionController@getAllComponentsForFreePositions');
    Route::get('/positions/list/tasks/{position}', 'OrderPositionController@listTasksForPosition');
    Route::get('/positions/list/beguntasks/{position}', 'OrderPositionController@listTasksForPosition');
    Route::get('/positions/list/componenttasks', 'OrderPositionController@listTasksForPositionComponent');
    Route::get('/positions/components/{position}', 'OrderPositionController@positionComponents');
    Route::get('/positions/tasks/{position}', 'OrderPositionController@positionTasks');
    Route::resource('/positions', 'OrderPositionController');      
    
     
    
    Route::get('/prodgroups/grupytree', 'ProductGroupController@buildTree');       
    Route::resource('/prodgroups', 'ProductGroupController');
    
    Route::post('/products/addtask', 'ProductController@addTaskForProduct');        
    Route::get('/products/availabletasks/{productId}', 'ProductController@listAvailableTasks');    
   // Route::get('/products/tasks/{product?}', 'ProductController@listTasksForProduct');       
    Route::get('/products/list/{taskGroups}', 'ProductController@listProductsByTaskGroup');     
    Route::get('/products/deleteseveral/{products}', 'ProductController@deleteSeveralProducts');     
    Route::get('/products/deletetask/{product}/{task}', 'ProductController@deleteTask');  
    Route::get('/products/tasks/changepriority/{product}/{stask}/{task}', 'ProductController@changePriorityTask');  
    Route::get('/products/tasks/{product}/{task}/edit', 'ProductController@editTask');  
    Route::get('/products/components/{product}', 'ProductController@getListComponents');  
    Route::get('/products/tasks/{product}', 'ProductController@getListTasks');      
    Route::get('/products/group/{groups}/{locale?}', 'ProductController@productsByGroups');      
    Route::resource('/products', 'ProductController');  
 
    
    Route::resource('/roles', 'RoleController');
    Route::get('/roles', 'RoleController@roles');
    Route::get('/roles/{roleId}/permissions', 'RoleController@listPermissions');
    Route::get('/roles/{roleId}/freepermissions', 'RoleController@listFreePermissions');
    Route::get('/roles/{roleId}/users', 'RoleController@listUsers');
    
    Route::get('/rolespermissions/delete', 'RolePermissionController@deleteByRoleAndPermissionId');        
    Route::get('/rolespermissions/edit', 'RolePermissionController@editByRoleAndPermissionId');        
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