<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller
{
    //Check if user is authorised to perform operations
    function is_authorised(){
        $user = $request->user();
    }

    //CRUD Operations
    function create(Request $request){
        
    }

    function read(){}

    function update(Request $request){}

    function delete($id){}
}
