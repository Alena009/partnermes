<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */
  
    use AuthenticatesUsers 
    {
        login as private userLogin;
        logout as private userLogout;
    }

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
    
    /**
     * Change default authentification field from "email" to "login"
     */
    public function username()
    {
        return 'login';
    }
    
    /**
     * Is user logged?
     * 
     */
    public function isLogged()
    {
        if (!\Auth::check())
        {
            return response()->json(["success" => false]);                                   
        }
        
        return response()->json(["success" => true]);                        
    }
    
    /**
     * Rewrite logout() method from AuthenticatesUsers.
     * Response in JSON-format is needed for front-end.
     * 
     */
    function logout(Request $request)
    {
        $this->userLogout($request);
                
        return $this->loggedOut($request) ?: response()->json(["success" => true]);                         
    }
    
    /**
     * Rewrite login() method from AuthenticatesUsers.
     * @param Request $request
     * @return redirect(if success) or json(if false)
     */
    function login(Request $request) {        
        if(!\Auth::attempt(['login'=>$request['login'],'password'=>$request['password']])) 
        {
            return response()->json([
                        "success"	=> false,
                        "message"	=> "Hasło i/lub login błędne"        
                    ]);              
        }

        return response()->json(["success" => true]);                                
    }
}
