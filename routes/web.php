<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/logged', 'Auth\LoginController@isLogged');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::group([
    'middleware' => ['auth']
        ], function () {  
            Route::get('/departaments/{locale}', 'DepartamentController@departaments');
            Route::resource('/departaments', 'DepartamentController');           
            Route::get('/orders/{locale}', 'OrderController@orders');
            Route::get('/orders', 'OrderController@orers');            
});