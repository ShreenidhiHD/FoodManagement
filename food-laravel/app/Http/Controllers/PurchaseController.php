<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller
{
    //Check if user is authorised to perform operations
    function is_authorised(){
        return Auth::guard('sanctum')->user();
    }

    //CRUD Operations
    function create(Request $request){
        if(!$this->is_authorised()){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $validated = $request->validate([
            'donation_id' => 'required|integer',
            'Created_by' => 'required|integer',
            'description' => 'required|string',
        ]);

        //Create new purchase request
        $request_status=DB::table('purchases')->insertGetId($validated);

        // Return a response...
        return response()->json([
            'message' => 'Food donation created successfully.',
            'donation' => $request_status, // Optional: Include the created purchase in the response
        ], 200);
    }

    function read($id){
        if(!$this->is_authorised()){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'donation', 'headerName' => 'Danation'],
            ['field' => 'buyer', 'headerName' => 'Buyer'],
            ['field' => 'buyer_email', 'headerName' => 'E-Mail'],
            ['field' => 'buyer_phone', 'headerName' => 'Phone'],
            ['field' => 'buyer_whatsapp', 'headerName' => 'WhatsApp'],
            ['field' => 'status', 'headerName' => 'Status'],
            ['field' => 'description', 'headerName' => 'Description'],
            ['field' => 'requested_at', 'headerName' => 'Request Time']
        ];

        //Fetch data from purchases table
        $purchases=DB::table('purchases')->where('donation_id',$id)->get();

        //Loop through the results to format results
        $rows =  $purchases->map(function($purchases) {
            //Get donation event name
            $event_name="";
            $event_names=DB::table('donations')->where('id',$purchases->donation_id)->first();
            $event_name=$event_names->event_name;
            //Get person name and contact information
            $user="";
            $phone="";
            $email="";
            $whatsapp="";
            $users=DB::table('users')->where('id',$purchases->Created_by)->first();
            $user=$users->name;
            $email=$users->email;
            $phone=$users->mobile;
            $whatsapp=$users->whatsapp;
            return[
                'id'=>$purchases->id,
                'donation'=>ucfirst($event_name),
                'buyer'=>ucfirst($user),
                'buyer_email'=>$email,
                'buyer_phone'=>$phone,
                'buyer_whatsapp'=>$whatsapp,
                'status'=>ucfirst($purchases->status),
                'description'=>ucfirst($purchases->description),
                'requested_at'=>date_format(date_create($purchases->created_at),'d-m-Y h:m a'),
            ];
        });

        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    function update(Request $request){
        if(!$this->is_authorised()){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $validated = $request->validate([
            'donation_id' => 'required|integer',
            'Created_by' => 'required|integer',
            'description' => 'required|string',
        ]);

        $status=DB::table('purchases')->where('id',$request->id)->update($validated);

        if($status){
            return response()->json(['message' => 'Request updated successfully'], 200);
        }

        return response()->json(['message' => 'Unable to update request'], 401);
    }

    function delete($id){
        if(!$this->is_authorised()){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $status=DB::table('purchases')->where('id',$id)->update(['status'=>'cancelled']);

        if($status){
            return response()->json(['message' => 'Request deleted successfully'], 200);
        }

        return response()->json(['message' => 'Unable to delete request'], 401);
    }
}
