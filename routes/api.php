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
    Route::post('/user', 'API\UserController@userDetails');
    Route::get('/departaments/{locale}', 'DepartamentController@departaments');
    Route::resource('/departaments', 'DepartamentController');   
    Route::resource('/workers', 'WorkersController');
});

Route::post('login', 'API\UserController@login');
Route::post('register', 'API\UserController@register');
