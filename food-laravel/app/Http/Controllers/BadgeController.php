<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Auth;

class BadgeController extends Controller
{
    public function my_donation_badge() {
        $user = Auth::guard('sanctum')->user();
    
        if(!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $donations = DB::table('donations')->where('Created_by', $user->id)->get();
    
        if(count($donations) > 0) { 
            return response()->json(['message' => count($donations)], 200); 
        } else { 
            return response()->json(['message' => '0'], 200); 
        }
    }
    

    public function my_purchases_badge() {
        $user = Auth::guard('sanctum')->user();
    
        if(!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $purchases = DB::table('purchases')->where('Created_by', $user->id)->get();
    
        if(count($purchases) > 0) { 
            return response()->json(['message' => count($purchases)], 200); 
        } else { 
            return response()->json(['message' => '0'], 200); 
        }
    }
    

    public function my_request_badge(){
        $user = Auth::guard('sanctum')->user();
    
        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $purchases=DB::table('purchases')->where('Created_by',$user->id)->get();
    
        if(count($purchases)>0){ 
            return response()->json(['message' => count($purchases)], 200); 
        } else { 
            return response()->json(['message' => '0'], 200); 
        }
    }    

    public function request_badge() {
        $user = Auth::guard('sanctum')->user();
    
        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $purchases = DB::table('purchases')->where('Created_by', '<>', $user->id)->get();
    
        if(count($purchases) > 0) { 
            return response()->json(['message' => count($purchases)], 200); 
        } else { 
            return response()->json(['message' => '0'], 200); 
        }
    }
    
}
