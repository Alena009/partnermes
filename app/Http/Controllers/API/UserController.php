<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Repositories\UserRepository;

class UserController extends BaseController 
{

    public $successStatus = 200;

    /**
     * login api 
     * 
     * @return \Illuminate\Http\Response 
     */
    public function login() 
    {
        if (Auth::attempt(['login' => request('login'), 'password' => request('password')])) {
            $user = Auth::user();
            $token = $user->createToken('MyApp')->accessToken;
            return response()->json(['success' => true, 'token' => $token], $this->successStatus);
        } else {
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }

    /**
     * Register api 
     * 
     * @return \Illuminate\Http\Response 
     */
    public function store(Request $request) 
    {
        $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'email' => 'required|email',
                    'password' => 'required',
                    'kod' => 'required',
                    'firstname' => 'required',
                    'lastname' => 'required',
                    'login' => 'required',
                    'is_worker' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $success['token'] = $user->createToken('MyApp')->accessToken;
        $success['name'] = $user->name;
        
        return response()->json(['success' => $success], $this->successStatus);
    }

    /**
     * details api 
     * 
     * @return \Illuminate\Http\Response 
     */
    public function show() 
    {
        $user = Auth::user();        
        return response()->json(['success' => true, 'data' => $user], $this->successStatus);
    }
    
    /**
     * Logout with revoking token
     */
    public function logout(Request $request)
    {
        $value = $request->bearerToken();
        $id = (new Parser())->parse($value)->getHeader('jti');
        $token = $request->user()->tokens->find($id);
        $token->revoke();

        return response()->json(['success' => 'You have been successfully logged out!'], $this->successStatus);
    }
    
    /**
     * 
     */
    public function edit(Request $request, $id)
    {
        return response()->json(['success' => true]);
    }
}
