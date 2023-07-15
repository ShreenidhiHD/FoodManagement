<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class adminController extends Controller
{
    public function users(){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'donation_id', 'headerName' => 'Donation ID'],
            ['field' => 'created_by', 'headerName' => 'Created By'],
            ['field' => 'contact', 'headerName' => 'WhatsApp'],
            ['field' => 'status', 'headerName' => 'Status'],
            ['field' => 'description', 'headerName' => 'Description'],
            ['field' => 'created_at', 'headerName' => 'Requested at']
        ];

        $users=DB::table('users')->where('role','<>','admin')->get();
    }
}
