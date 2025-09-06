<?php

namespace App\Http\Controllers;

use App\Mail\ExampleEmail;
use App\Models\Chauffeur;
use App\Models\Friend;
use App\Models\Image;
use App\Models\Organisateur;
use App\Models\Publication;
use App\Models\PublicationMedia;
use App\Models\PublicationUserView;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;


class AuthController extends Controller
{
    public $token = '';

    function __construct(){
        $this->middleware(['auth:sanctum'])->except(['login', 'register', 'forgotPassword', 'uploadImage']);
    }

    public function mailler($request){
        try{
            $content = $request['content']; 
            $senderEmail = $request['user'];
            $subject = $request['subject'];
            
            Mail::to($senderEmail)->send(new ExampleEmail($content, $subject, $senderEmail));
            return response()->json(['message' => 'Email sent successfully'], 200);
        }catch(\Exception $e){
            return response()->json('Email not sent '.$e->getMessage(), 500);
        }
    }

     /* Register a new user. */
    public function register(Request $request)
    {
        $validationValues = [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'passwordConfirmed' => 'required|string|min:8',
        ];

        // Invok validation by role 
        if ($request->role == 'chauffeur') {
            $validationValues['pseudo'] = 'required|string|max:50|unique:chauffeurs';
            $validationValues['carBrind'] = 'required|string|max:500';
            $validationValues['categorie'] = 'required|string|max:10';
            $validationValues['numCardPro'] = 'required|string|max:30';
            $validationValues['imageRecto'] = 'required|string';
            $validationValues['imageVerso'] = 'required|string';
        }else if ($request->role == 'organisateur'){
            $validationValues['organization'] = 'required|string|max:50';
            $validationValues['address'] = 'required|string|max:200';
        }

        $validator = Validator::make($request->all(), $validationValues);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $isExists = User::where('email', $request->email)->count();
        // return $isExists;
        if($isExists > 0){
            return response()->json(['message' => 'email already exist!'], 500);
        }else {

            $role_id = Role::where('role_name', $request->role)->first(['id'])->id;
            $user_id = Uuid::uuid4()->toString();
            
            try {
                $user = new User;
                $user->id = $user_id;
                $user->firstname = $request->firstname; 
                $user->lastname = $request->lastname; 
                $user->email = $request->email; 
                $user->password = $request->password; 
                $user->email = $request->email;
                $user->password = Hash::make($request->password);
                $user->role_id = $role_id;

                if ($request->image) {
                    $image = $this->_uploadImage($request->image, 'image');
                    $user->image_id = $image->id;
                }
                
                $user->save();
    
                if($request->role == 'chauffeur'){
                    $chauffeur = new Chauffeur;
                    $chauffeur->user_id = $user_id ;
                    $chauffeur->pseudo = $request->pseudo;
                    $chauffeur->carBrind = $request->carBrind;
                    $chauffeur->categorie = $request->categorie;
                    $chauffeur->numCardPro = $request->numCardPro;
                    
                    $imageRecto = $this->_uploadImage($request->imageRecto, 'document');
                    $chauffeur->imageRectoId = $imageRecto->id;

                    $imageVerso = $this->_uploadImage($request->imageVerso, 'document');
                    $chauffeur->imageVersoId = $imageVerso->id;

                    $chauffeur->save();
                }else{
                    $organisateur = new Organisateur;
                    $organisateur->user_id = $user_id;
                    $organisateur->organization = $request->organization;
                    $organisateur->address = $request->address;
                    $organisateur->save();
                }
    
                return response()->json(['message' => 'User registered successfully'], 201);
           } catch (\Exception $e) {
            if(isset($user)){
                User::where('id', $user->id)->forceDelete();
            }
            return response()->json(['message' => 'error from server :  '. $e->getMessage()], 500);
           }
        }

    }

    /* Login user and create token. */
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            \Log::info('Login attempt for: ' . $credentials['email']);
            
            if (Auth::attempt($credentials)) {
                \Log::info('Auth successful for: ' . $credentials['email']);
                $user = Auth::user()->load('friends.user.image');
                if($user->pointDuration != 0){
                    $user->pointDuration -= 1; 
                }else{
                    $user->pointDuration = 0; 
                }
                $user->save(); 
                $role = $user->role;
                $user->image;
                if($role->role_name == "chauffeur"){
                   $user->chauffeur;
                }else if($role->role_name == "organisateur"){
                   $user->organisateur;
                }

                if($user->status == 'toValidate'){
                    return response()->json(['message' => 'votre compte a été suspendu, nous le vérifierons dès que possible'], 403);
                }

                $token = $user->createToken('authToken')->plainTextToken;
                return response()->json(['message' => 'ok', 'token' => $token, 'type_token' => 'Bearer', 'user_info' => $user], 200);
            }
            return response()->json(['message' => 'Unauthorized'], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => 'error from server : '. $e->getMessage()], 500 );
        }
    }

    public function profile()
    {
        try {
            if(auth()->user()){
                $user = auth()->user()->load('friends.user.image');
                $role = $user->role;
                $user->image;
                
                if($role->role_name == "chauffeur"){
                    $user->chauffeur;
                }else if($role->role_name == "organisateur"){
                    $user->organisateur;
                }

                return response()->json($user, 200);
            }else {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'error from server : '. $e->getMessage()], 500 );
        }
    }

    /* Logout */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'ok'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'error : '. $e->getMessage()], 500);
        }
    }

    /* Forgot password */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = \Password::sendResetLink($request->only('email'));

        return $status === \Password::RESET_LINK_SENT
                    ? response()->json(['message' => 'Reset link sent to your email.'], 200)
                    : response()->json(['error' => 'Unable to send reset link'], 400);
    }

    function friends() {
        try {
            $user = auth()->user()->load('friends.user.image');
            return  response()->json($user, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'error from server : '+ $e->getMessage()], 500);
        }
    }

    function invitation(Request $request) {
        try {
            $user = auth()->user();
           
            $email = $user->email; 
            $name = $user->firstName . ' ' . $user->lastName; 

            $customerName = explode('@',$request->content)[0];

            $content['user'] = $email;
            $content['subject'] = "JIAYI - New Friend Alert!";

            if($request->contentType == 'email'){
                $user = User::where('email', $request->content)->first();
                if($user){
                  
                    $content['content'] = "Hey $customerName\n\n
                    
                    Exciting news – you've got a new friend on JIAYI!\n
                    Feel free to reach out and say hi. We think you two will hit it off!\n\n 
                    Happy connecting,\n\n
                    
                    $name\n
                    JIAYI Team";
                    $this->mailler($content);
                    return response()->json(['message' => 'user found by email !!!!, friend invitation have been sent'], 200);
                }

                $content['content'] = "Hey $customerName\n\n
                $name with $email has invited you to use JIAYI to collaborate with them. use the button below to set up your account and get started.
                $name\n
                JIAYI Team";
              
            $this->mailler($content);

            return response()->json(['message' => 'user not found by email !!!!,application invitation have been sent'], 200);   
            }
    
            $user = Chauffeur::where('pseudo', $request->content)->first();
            if($user){
                $content['content'] = "Hey $customerName\n\n
                    
                    Exciting news – you've got a new friend on JIAYI!\n
                    Feel free to reach out and say hi. We think you two will hit it off!\n\n 
                    Happy connecting,\n\n
                    
                    $name\n
                    JIAYI Team";
                $this->mailler($content);
                return response()->json(['message' => 'user found by pseudo !!!!, friend invitation have been sent'], 200);
            }

            return response()->json(['error' => 'the user preudo not exist, please enter the email instead'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'error from server : '. $e->getMessage()], 500);
        }
    }

    function unfollowFriend($relationId) {
        if($relationId == 0){
            return response()->json(['error' => 'bad request'], 400);
        }

       try {
            $relationship = Friend::where('id', $relationId)->first();
            $user_id = $relationship->user_id;
            $friend_id = $relationship->friend_id;
            $otherRelationship = Friend::where('user_id', $friend_id)->where('friend_id', $user_id)->first();
            // return ['relationship' => $relationship, 'otherRelationship' => $otherRelationship];
            if ($relationship) {
                $relationship->delete();    
            }

            if ($otherRelationship) {
                $otherRelationship->delete();    
            }
            return response()->json(['message' => "unfollow operation is done"], 202);
        } catch (\Exception $e) {
            return response()->json(['error' => "error from server : " . $e->getMessage()], 500);
        }
    }

    function shareWithFriends(Request $request) {
        if(count($request->all()) == 0){
            return response()->json(['error' => 'bad request'], 400);
        }
       try {
            Friend::whereIn('id', $request->friends)->update(['share_note' => 1]);
            return response()->json(['message' => "sharing note with operation is done with success"], 202);
        } catch (\Exception $e) {
            return response()->json(['error' => "error from server : " + $e->getMessage()], 500);
        }
    }

    function updateProffeInfo(Request $request) {
        try {
            $user = auth()->user()->load('chauffeur');
            $chauffeur = Chauffeur::where('user_id', $user->chauffeur->user_id)->first();
            $chauffeur->numCardPro = $request->numCardPro;
            $chauffeur->save();

            $user->status = "toValidate";
            $user->save();
            
            response()->json($user, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'error from server ' . $e], 500);
        }
    }

    function updatePersonalInfo(Request $request) {
        try {
            
            if($request->role == 'chauffeur'){
                $user = auth()->user()->load(['chauffeur', 'role']);
                $chauffeur = Chauffeur::where('user_id', $user->chauffeur->user_id)->first();
                $chauffeur->carBrind = $request->carBrind;
                $chauffeur->categorie = $request->categorie;
                $chauffeur->pseudo = $request->pseudo;
                $chauffeur->save();
            }else if($request->role == 'organisateur'){
                $user = auth()->user()->load(['organisateur', 'role']);
                $organizateur = Organisateur::where('user_id', $user->organisateur->user_id)->first();
                $organizateur->organization	= $request->organizateur;
                $organizateur->address = $request->address;
                $organizateur->save();
            }
            
            $user->lastName = $request->lastName;
            $user->firstName = $request->firstName;
            $user->email = $request->email;
            $user->save();
            
            $newInfo = auth()->user()->load(['chauffeur', 'organisateur', 'role']);

            return response()->json($newInfo, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'error from server ' . $e], 500);
        }
    }

    function updatePassword(Request $request) {
       
        try {
            $user = auth()->user();
            $isPasswordCorrect = Hash::check($request->password, $user->password);
            if($isPasswordCorrect){
                $user->password = Hash::make($request->newPassword);
                $user->save();
                return response()->json(["message" => "ok"], 200);
            };
            return response()->json(["message" => "le mot de passe est pas correct!"], 401);
        } catch (\Exception $e) {
            return response()->json(["message" => "error depuis le server : " .$e], 500);
        }
    }

    function updateSetting(Request $request) {
        try {
            $user = auth()->user();
            $user->ray = $request->ray;
            $user->visibility = $request->visibility;
            $user->notification = $request->notification;
            $user->pointDuration = $request->pointDuration;
            $user->seeNotesPoint = $request->seeNotesPoint;
            $user->save();
            return response()->json(["message" => "ok", 'status' => 200], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => "error depuis le server : " .$e], 500);
        }
     }

    private function _uploadImage($base64Image, $type)
    {
        // Check if the base64 string contains the correct prefix
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $imageType)) {
            // Get the image type (e.g., jpeg, png, gif)
            $imageExtension = $imageType[1]; // jpg, png, gif, etc.
            
            // Remove the base64 prefix from the string
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            
            // Decode the base64 image data
            $decodedImage = base64_decode($base64Image);

            // Generate a unique filename with the appropriate extension
            $filename = $type . "_" . time() . '.' . $imageExtension;

            // Define the path where you want to save the image within the storage/app/public directory
            $filePath = 'images/' . $filename;

            // Save the image to the storage directory
            Storage::disk('public')->put($filePath, $decodedImage);

            // Store the image information in the database
            $image = new Image();
            $image->url = $filePath;
            $image->type = $type;
            $image->save();

            // Return the image object
            return $image;
        }

        return null;
    }


    public function get_publication_data(){
        $data = [];
        $publicatons = Publication::select()->where('active',true)->orderBy('order','asc')->with('media')->get();
        foreach ($publicatons as $publication) {
            $count_view = PublicationUserView::where('publication_id',$publication->id)->where('type','view')->count();
            $count_click = PublicationUserView::where('publication_id',$publication->id)->where('type','click')->count();
            $publication->count_view = $count_view;
            $publication->count_click = $count_click;
            $publication->media->url = asset($publication->media->url);
            $data[] = $publication;
        }

        return $data;
    }

    public function listPublication(Request $request){
        try {
            $data = $this->get_publication_data();
            return response()->json(['data'=> $data],200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);

        }
    }


    public function add_publication_action(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required',
                'publication_id' => 'required',
                'type' => 'required|string|in:view,click|max:10',
            ]);
    
            // Check if validation fails
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Bad Request',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $user_id = $request->user_id;
            $publication_id = $request->publication_id;
            $type = $request->type;
            PublicationUserView::create([
                'user_id'=> $user_id,
                'publication_id'=> $publication_id,
                'type'=> $type,
            ]);

            $new_data = $this->get_publication_data();
            return response()->json(['message'=> 'ok','data'=>$new_data],200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);

        }
    }
}
