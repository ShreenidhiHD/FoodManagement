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
            ['field' => 'name', 'headerName' => 'Name'],
            ['field' => 'email', 'headerName' => 'E-Mail'],
            ['field' => 'mobile', 'headerName' => 'Mobile'],
            ['field' => 'whatsapp', 'headerName' => 'WhatsApp'],
            ['field' => 'address', 'headerName' => 'Address'],
            ['field' => 'pincode', 'headerName' => 'Pincode'],
            ['field' => 'role', 'headerName' => 'Role'],
            ['field' => 'status', 'headerName' => 'Status']
        ];

        $users=DB::table('users')->where('role','<>','admin')->get();

        $rows = $users->map(function($user) {
            return [
                'id' => $user->id,
                'name' => ucfirst($user->name),
                'email' => $user->email,
                'mobile'=>$user->mobile,
                'whatsapp' => $user->whatsapp,
                'address'=>ucfirst($user->address),
                'pincode'=>$user->pincode,
                'role'=>ucfirst($user->role),
                'status'=>ucfirst($user->status),
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function donations(){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'number_of_plates', 'headerName' => 'Number of Plates'],
            ['field' => 'delivery_status', 'headerName' => 'Delivery Status'],
            ['field' => 'price', 'headerName' => 'Price'],
            ['field' => 'expiry_in_days', 'headerName' => 'Expiry in Days'],
            ['field' => 'food_type', 'headerName' => 'Food Type'],
            ['field' => 'event_name', 'headerName' => 'Event Name'],
            ['field' => 'description', 'headerName' => 'Description'],
            ['field' => 'prepared_date', 'headerName' => 'Prepared date'],
            ['field' => 'status', 'headerName' => 'Status'],
            ['field' => 'Created_by', 'headerName' => 'Created By'],
            ['field' => 'country', 'headerName' => 'Country'],
            ['field' => 'state', 'headerName' => 'State'],
            ['field' => 'city', 'headerName' => 'City'],
            ['field' => 'pincode', 'headerName' => 'Pincode'],
            ['field' => 'created_at', 'headerName' => 'Created_at']
        ];

        $donations=DB::table('donations')->get();

        $rows = $donations->map(function($donation) {
            return [
                'id' => $donation->id,
                'number_of_plates' => $donation->id,
                'delivery_status' => $donation->id,
                'price' => $donation->event_name,
                'expiry_in_days' => $donation->event_name,
                'prepared_date' => $donation->prepared_date,
                'status' => $donation->status,

            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }
}
