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
    Route::resource('/history', 'OrderHistoryController');         
    Route::resource('/toolsoperations', 'ToolOperationController');      
    Route::resource('/tools', 'ToolController');  

    Route::get('/departaments/grupytree', 'DepartamentController@buildTree');
    Route::get('/departaments/{departament}/translations', 'DepartamentController@getTranslations');
    Route::resource('/departaments', 'DepartamentController'); 
    
    Route::get('/operations/save', 'OperationController@save');      
    Route::get('/operations/taskchange', 'OperationController@taskchange');      
    //Route::get('/operations/list/{grupy}', 'OperationController@listOperations');      
    Route::resource('/operations', 'OperationController'); 

    Route::get('/orders/{orderId}/close',   'OrderController@closeOrder');    
    Route::get('/orders/last',              'OrderController@getLastOrder');
    Route::resource('/orders',              'OrderController');    
    
    Route::get('/positions/byorder/{order}',         'OrderPositionController@getPositionsByOrder');    
    Route::get('/positions/getPrinted',              'OrderPositionController@getPrinted');    
    Route::get('/positions/zlecenia',                'OrderPositionController@getZlecenia');    
    Route::get('/positions/components/{position}',   'OrderPositionController@positionComponents');
    Route::get('/positions/{position}/tasks',        'OrderPositionController@positionsTasks');
    Route::get('/positions/{positions}/print',       'OrderPositionController@print');
    Route::get('/positions/{positions}/close',       'OrderPositionController@close');
    Route::get('/positions/{positions}/dontproduct', 'OrderPositionController@dontProduct');
    Route::get('/positions/{positions}/reopen',      'OrderPositionController@reOpen');
    Route::resource('/positions', 'OrderPositionController');      
    
    Route::get('/prodtypes/{prodtype}/translations', 'ProductTypeController@getTranslations');
    Route::resource('/prodtypes', 'ProductTypeController');            

    Route::delete(  '/prodgroups/{group}/tasks/{task}',        'ProductGroupController@deleteTask'); 
    Route::get(     '/prodgroups/{group}/tasks/{task}/edit',   'ProductGroupController@editTask');  
    Route::post(    '/prodgroups/{group}/tasks',               'ProductGroupController@addTask'); 
    Route::get(     '/prodgroups/{groups}/tasks/{locale?}',    'ProductGroupController@tasks');         
    Route::get(     '/prodgroups/{groups}/products/{locale?}', 'ProductGroupController@products');      
    Route::get(     '/prodgroups/grupytree/{locale?}',         'ProductGroupController@buildTree');               
    Route::resource('/prodgroups', 'ProductGroupController');     

    Route::delete(  '/products/{product}/components/{component}', 'ProductController@deleteComponent');      
    Route::post(    '/products/{product}/components/{locale?}',   'ProductController@addComponent');  
    Route::get(     '/products/{products}/components/{locale?}',  'ProductController@components');      
    Route::delete(  '/products/{product}/tasks/{task}',        'ProductController@deleteTask');      
    Route::post(    '/products/{product}/tasks/{locale?}',     'ProductController@addTask');  
    Route::get(     '/products/{product}/tasks/{task}/edit',   'ProductController@editTask');      
    Route::get(     '/products/{product}/tasks/{locale?}',     'ProductController@tasks');                  
    Route::get(     '/products/{product}/freetasks/{locale?}', 'ProductController@freeTasks');                  
    Route::resource('/products', 'ProductController');  
 
    
    Route::get('/roles', 'RoleController@roles');
    Route::get('/roles/{roleId}/permissions', 'RoleController@listPermissions');
    Route::get('/roles/{roleId}/freepermissions', 'RoleController@listFreePermissions');
    Route::get('/roles/{roleId}/users', 'RoleController@listUsers');
    Route::resource('/roles', 'RoleController');    
    
    Route::get('/rolespermissions/delete', 'RolePermissionController@deleteByRoleAndPermissionId');        
    Route::get('/rolespermissions/edit', 'RolePermissionController@editByRoleAndPermissionId');        
    Route::resource('/rolespermissions', 'RolePermissionController');          
    
    Route::delete('/tasks/{task}/translations/{locale}',      'TaskController@delTranslation');
    Route::post(  '/tasks/{task}/translations',               'TaskController@addTranslation');
    Route::get(   '/tasks/{task}/translations/{translation}', 'TaskController@editTranslation');
    Route::get(   '/tasks/{task}/translations',               'TaskController@getTranslations');
    Route::get('/tasks/notfororder',            'TaskController@notForOrder');    
    Route::get('/tasks/listbygroups/{groups?}', 'TaskController@listByGroups');    
    Route::resource('/tasks', 'TaskController');    
    
    Route::delete('/taskgroups/{taskgroup}/translations/{locale}',      'TaskGroupController@delTranslation');
    Route::post(  '/taskgroups/{taskgroup}/translations',               'TaskGroupController@addTranslation');
    Route::get(   '/taskgroups/{taskgroup}/translations/{translation}', 'TaskGroupController@editTranslation');
    Route::get(   '/taskgroups/{taskgroup}/translations',               'TaskGroupController@getTranslations');
    Route::get(   '/taskgroups/grupytree/{locale?}',                    'TaskGroupController@buildTree');    
    Route::resource('/taskgroups', 'TaskGroupController');    
    
    Route::get('/usersroles/del', 'UserRoleController@deleteByRoleAndUserId');
    Route::resource('/usersroles', 'UserRoleController');
        
    Route::get('/users/freeusers', 'API\UserController@getAllFreeUsers');
    Route::get('/users/avatar/{userId}', 'API\UserController@avatar');
    Route::post('/users/avatar/load/{userId}', 'API\UserController@loadAvatar');
    Route::resource('/users', 'API\UserController');
    
    Route::get('/workerdep/{departament?}/workers', 'DepartamentController@workersList');   
    Route::get('/workerdep/{departament}/deleteworker/{worker}', 'WorkerDepartamentController@deleteWorker');
    Route::resource('/workerdep', 'WorkerDepartamentController');
    
    Route::get('/warehouse/amountproduct/{productId}', 'WarehouseController@amountProductInWarehouse');  
    Route::get('/warehouse/products/{grupy?}', 'WarehouseController@products');  
    Route::resource('/warehouse', 'WarehouseController');  
});

Route::post('login', 'API\UserController@login');
Route::post('register', 'API\UserController@register');
Route::post('/logout', 'Auth\LoginController@logout');


Route::post('/logged', 'Auth\LoginController@isLogged');