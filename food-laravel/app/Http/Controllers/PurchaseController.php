<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Purchase;
use App\Models\Donation;

class PurchaseController extends Controller
{
    // Check if user is authorised to perform operations
    public function is_authorised(Request $request) {
        $user = $request->user();
    }

    // Function to handle purchase creation
    public function createPurchase(Request $request)
    {
        $user = $request->user();
        $purchase = Purchase::where('donation_id', $request->donation_id)
            ->where('Created_by', $user->id)
            ->first();

        if ($purchase) {
            // If a purchase entry already exists, update the status to pending
            $purchase->status = 'pending';
            $purchase->description = $request->description;
            $purchase->save();

            return response()->json(['message' => 'Request updated successfully'], 200);
        } else {
            // If no purchase entry exists, create a new one
            $purchase = new Purchase;
            $purchase->donation_id = $request->donation_id;
            $purchase->Created_by = $user->id;
            $purchase->status = 'pending';
            $purchase->description = $request->description;
            $purchase->save();

            return response()->json(['message' => 'Request created successfully'], 200);
        }
    }

    public function user_donation_request(Request $request,$id){
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

        $requests=DB::table('purchases')->where('donation_id',$id)->get();

        $rows = $requests->map(function($requst) {
            $requested_by="";
            $whatsapp="";
            $requested_user=DB::table('users')->where('id',$requst->Created_by)->first();
            $requested_by=$requested_user->name;
            $whatsapp=$requested_user->whatsapp;
            return [
                'id' => $requst->id,
                'donation_id' => $requst->donation_id,
                'created_by' => ucfirst($requested_by),
                'contact'=>$whatsapp,
                'status' => ucfirst($requst->status),
                'description'=>ucfirst($requst->description),
                'created_at'=>date_format(date_create($requst->created_at),'d-m-Y h:m:s a'),
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);

    }

    // Function to handle purchase cancellation
    // public function cancelPurchase(Request $request, $id)
    // {
    //     $purchase = Purchase::where('id', $id)
    //         ->where('Created_by', Auth::id())
    //         ->first();

    //     if (!$purchase) {
    //         return response()->json(['message' => 'Purchase not found'], 404);
    //     }

    //     if ($purchase->status == 'cancelled') {
    //         return response()->json(['message' => 'Purchase already cancelled'], 200);
    //     }

    //     $purchase->status = 'cancelled';
    //     $purchase->save();

    //     return response()->json(['message' => 'Purchase cancelled'], 200);
    // }
    
    public function cancelPurchase(Request $request, $donationId)
    {
        $purchase = Purchase::where('donation_id', $donationId)
            ->where('Created_by', Auth::id())
            ->first();
    
        if (!$purchase) {
            return response()->json(['message' => 'Purchase not found'], 404);
        }
    
        if ($purchase->status == 'cancelled') {
            return response()->json(['message' => 'Purchase already cancelled'], 200);
        }
    
        $purchase->status = 'cancelled';
        $purchase->save();
    
        return response()->json(['message' => 'Purchase cancelled'], 200);
    }
    

    // CRUD Operations
    function create(Request $request){
        $this->is_authorised($request);
        return $this->createPurchase($request);
        
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
    }
     function deletes(Request $request, $id){
        $this->is_authorised($request);
        return $this->cancelPurchase($request, $id);
    }

    // public function purchase_list(Request $request,$id) {
    //     // Sanctum provides a handy way to get the authenticated user
    //     $user = $request->user();
    //     if (!$user) {
    //         return response()->json(['message' => 'User not authenticated'], 401);
    //     }
    
    //     $purchases = DB::table('purchases')->where('Created_by',$id)->get();
    
    //     // Structure the data as needed for the frontend
    //     $columns = [
    //         ['field' => 'id', 'headerName' => 'ID'],
    //         ['field' => 'event_name', 'headerName' => 'Event Name'],
    //         ['field' => 'description', 'headerName' => 'Description'],
    //         ['field' => 'status', 'headerName' => 'Status'],
    //         ['field' => 'created_at', 'headerName' => 'Request date']
    //     ];
        
    //     $rows = $purchases->map(function($purchases) {
    //         $event_name="";
    //         $event_names=DB::table('donations')->where('id',$purchases->donation_id)->first();
    //         $event_name=$event_names->event_name;
    //         return [
    //             'id' => $purchases->id,
    //             'event_name' => $event_name,
    //             'description' => $purchases->description,
    //             'status' => $purchases->status,
    //             'created_at'=>$purchases->created_at,
    //         ];
    //     });
    
    //     return response()->json([
    //         'columns' => $columns,
    //         'rows' => $rows
    //     ]);
    // }
    public function purchase_list(Request $request) {
        // Sanctum provides a handy way to get the authenticated user
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $purchases = (new Purchase)->userPurchases($user->id);
    
        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'event_name', 'headerName' => 'Event Name'],
            ['field' => 'description', 'headerName' => 'Description'],
            ['field' => 'status', 'headerName' => 'Status'],
            ['field' => 'created_at', 'headerName' => 'Request date']
        ];
        
        $rows = $purchases->map(function($purchase) {
            $event_name="";
            $event_names=DB::table('donations')->where('id',$purchase->donation_id)->first();
            $event_name=$event_names->event_name;
            return [
                'id' => $purchase->id,
                'event_name' => $event_name,
                'description' => $purchase->description,
                'status' => $purchase->status,
                'created_at' => $purchase->created_at->format('Y-m-d H:i:s'),
                'donation_id' => $purchase->donation_id 
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }
    public function userPendingPurchases(Request $request) {
        // Sanctum provides a handy way to get the authenticated user
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $purchases = (new Purchase)->userPendingPurchases($user->id);
    
        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'event_name', 'headerName' => 'Event Name'],
            ['field' => 'description', 'headerName' => 'Description'],
            ['field' => 'status', 'headerName' => 'Status'],
            ['field' => 'created_at', 'headerName' => 'Request date']
        ];
    
        $rows = $purchases->map(function($purchase) {
            $event_name = "";
            $event_names = DB::table('donations')->where('id', $purchase->donation_id)->first();
            $event_name = $event_names->event_name;
            return [
                'id' => $purchase->id,
                'event_name' => $event_name,
                'description' => $purchase->description,
                'status' => $purchase->status,
                'created_at' => $purchase->created_at->format('Y-m-d H:i:s'),
                'donation_id' => $purchase->donation_id 
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }
    
    
}
