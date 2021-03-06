<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Repositories\UserRepository;
use Intervention\Image\Facades\Image as ImageInt;


class UserController extends \App\Http\Controllers\BaseController
{
    protected $rep;
    
    public function __construct(UserRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   

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
            if ($user->role->first()) {
                $user->permissions = $user->role->first()->permissions;            
            }
            $token = $user->createToken('MyApp')->accessToken;
            return response()->json(['success' => true, 'token' => $token, 'user' => $user], $this->successStatus);
        } else {
            return response()->json(['success' => false, 'message' => 'Unauthorised user']);
        }
    }

    /**
     * Register  
     * 
     * @return \Illuminate\Http\Response 
     */
    public function store(Request $request, $locale = 'pl') 
    {              
        $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    //'email' => 'email',
                    'password' => 'required',
                    'kod' => 'required',
                    'firstname' => 'required',
                    'lastname' => 'required',
                    'login' => 'required',
                    'is_worker' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 402);
        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $success['token'] = $user->createToken('MyApp')->accessToken;
        $success['name'] = $user->name;        
        
        return response()->json(['success' => $success, 'data' => $user]);
    }
    
    /**
     * Editing information about user
     */
    public function edit(Request $request, $id, $locale = 'pl')
    {        
        $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    //'email' => 'email',
                    //'password' => 'required',
                    'kod' => 'required',
                    'firstname' => 'required',
                    'lastname' => 'required',
                    'login' => 'required',
                    'is_worker' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 402);
        }
        $input = $request->all();

        if (!empty($input['password'])){
            $input['password'] = bcrypt($input['password']);
        } else {
            unset($input['password']);
        }
        
        $user = User::find($id);
        
        if ($user->fill($input)->save()) {
            return response()->json(['success' => true, 'data' => $user]);
        } else {
            return response()->json(['success' => false, 'data' => []]);
        }        
    }    

    /**
     * Loading users avatars
     * 
     * @param Request $request
     * @param int $userId
     * @return json response
     */
    public function loadAvatar(Request $request, $userId) 
    {     
        $path = public_path('uploads/avatars');
        
        if ($request->hasFile('image')) {
            $file = $request->file('image'); 
            $filename = $path . '/' . $userId . '.' . $file->getClientOriginalExtension();
            if (file_exists($filename)) { 
                unlink($filename);
                if (!file_exists($filename)) {
                    $success = $this->loadFile($file, $path, $userId);
                }
            } else  {
                $success = $this->loadFile($file, $path, $userId);
            }
        }   
        
        return response()->json(['success' => $success]);        
    }
    
    /**
     * Function for loading files to the public path
     * 
     * @param type $file
     * @param string $path
     * @param string $name
     * @return bool
     */
    function loadFile($file, $path, $name) 
    {       
        $name = $name.'.'.$file->getClientOriginalExtension();
        $destinationPath = $path;
        return $file->move($destinationPath, $name);                    
    }


    /**
     * details api 
     * 
     * @return \Illuminate\Http\Response 
     */
//    public function show() 
//    {
//        $user = Auth::user();  
//        
//        return response()->json(['success' => true, 'data' => $user], $this->successStatus);
//    }
    
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
    
    /*
     * Show avatar
     */
    public function avatar($userId)
    {    
        $imgPath = "uploads/avatars/empty_user.jpg";
        $filename = "uploads/avatars/" . $userId . ".jpg";
        
        if (file_exists($filename)) {
            $imgPath = $filename;        
        }       

        return response()->json(['success' => true, 'data' => $imgPath]);
    }
    
//    public function destroy($id, array $parameters = null)
//    {
//        $user = User::find($id);
//        if ($user->delete()) {
//            return ['success' => true,'class'=>__CLASS__,'method' => __METHOD__];
//        }else{
//            return ['success' => false, 'id' => $id,'msg'=>$this->repository->errors(),'class'=>__CLASS__,'method' => __METHOD__];
//        }
//    }
    
    public function index($locale = 'pl')
    {
        $users = [];
        $users = $this->repository->getAllWithAdditionals();
//        $users = User::all();
//        
//        foreach ($users as $user) {
//            $user['key']   = $user['id'];
//            $user['label'] = $user['name']; 
//            $user['value'] = $user['id'];
//            $user['text']  = $user['name'];             
//        }
        
        return response()->json(['success' => true, 'data' => $users]);
    }
    
    /**
     * Gets list of all users who do not have opened tasks (do not work now)
     *  
     * @return json
     */
    public function getAllFreeUsers()
    {
        $freeUsersIds = [];
        $busyUsersIds = [];
        
        $busyUsersIds = \App\Models\Operation::where("closed", "<", 1)->pluck("user_id");
        $freeUsersIds = User::whereNotIn("id", $busyUsersIds)->pluck("id");
        $freeUsers = $this->repository->getFewWithAdditionals($freeUsersIds);
                
        return response()->json(['success' => true, 'data' => $freeUsers]);    
    }
}
