<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Purchase;
use App\Models\Donation;
use App\Helpers\EmailHelper;

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
    
    // Create a new purchase entry regardless of whether one already exists or not
    $purchase = new Purchase;
    $purchase->donation_id = $request->donation_id;
    $purchase->Created_by = $user->id;
    $purchase->status = 'pending';
    $purchase->description = $request->description;
    $purchase->save();
    
    $donation=DB::table('donations')->where('id',$purchase->donation_id)->first();
    try {
        // Send email notification
        $emailData = [
            'to' => $user->email,
            'subject' => 'Request sent successfully ' . $donation->event_name,
            'data' => [
                'name' => $user->name,
                'message' => 'You have successfully requested a donation <b>'. $donation->event_name . '</b> at <b>' . $purchase->created_at . '</b>. Your Purchase ID is: <b>' . $purchase->id . '</b>',
            ],
        ];
                  
        
        EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
    } catch (\Exception $e) {
        // Log the exception or handle it in another way
        \Log::error('Failed to send email: '.$e->getMessage());
    }

    return response()->json(['message' => 'Request created successfully'], 200);
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
        try {
            // Send email notification
            $emailData = [
                'to' => $user->email,
                'subject' => 'Donation request successfully : ' . $purchase->id,
                'data' => [
                    'name' => $user->name,
                    'message' => 'You have successfully created a donation entry for the event <b>'. $donation->event_name . '</b> at <b>' . $donation->created_at . '</b>. Thank you for your generous contribution to help reduce food waste. Your Donation ID is: <b>' . $donation->id . '</b>',
                ],
            ];
                      
            
            EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
        } catch (\Exception $e) {
            // Log the exception or handle it in another way
            \Log::error('Failed to send email: '.$e->getMessage());
        }
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);

    }

    // Function to handle purchase cancellation
    
    public function cancelPurchase(Request $request, $donationId)
    {
        $user = Auth::guard('sanctum')->user();
        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }
        // Fetch the latest purchase entry instead of the first one
        $purchase = Purchase::where('donation_id', $donationId)
            ->where('Created_by', Auth::id())
            ->latest()
            ->first();
    
        if (!$purchase) {
            return response()->json(['message' => 'Purchase not found'], 404);
        }
    
        if ($purchase->status == 'cancelled') {
            return response()->json(['message' => 'Purchase already cancelled'], 200);
        }
        if ($purchase->status == 'accepted') {
            return response()->json(['message' => 'Cancel failed Purchase already appected'], 401);
        }
    
        $purchase->status = 'cancelled';
        $purchase->save();
        try {
            // Send email notification
            $emailData = [
                'to' => $user->email,
                'subject' => 'Donation request canceled successfully : ' . $purchase->id,
                'data' => [
                    'name' => $user->name,
                    'message' => 'Donation request canceled successfully : ' . $purchase->id ,
                ],
            ];
                      
            
            EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
        } catch (\Exception $e) {
            // Log the exception or handle it in another way
            \Log::error('Failed to send email: '.$e->getMessage());
        }
        return response()->json(['message' => 'Purchase cancelled'], 200);
    }
    
    
    public function cancelRequest(Request $request, $id)
    {
        $user = Auth::guard('sanctum')->user();
        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }
        $purchase = Purchase::where('id', $id)
            ->first();
        $userfrom=DB::table('users')->where('id', $purchase->Created_by)->first();
        if (!$purchase) {
            return response()->json(['message' => 'Purchase not found'], 404);
        }
    
        if ($purchase->status == 'cancelled') {
            return response()->json(['message' => 'Purchase already cancelled'], 200);
        }

        if ($purchase->status == 'rejected') {
            return response()->json(['message' => 'Purchase already rejected'], 200);
        }
    
        $purchase->status = 'rejected';
        $purchase->save();
        try {
            // Send email notification
            $emailData = [
                'to' => $user->email,
                'subject' => 'Donation request rejected successfully : ' . $purchase->id,
                'data' => [
                    'name' => $user->name,
                    'message' => 'Donation request rejected successfully : ' . $purchase->id ,
                ],
            ];
                      
            
            EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
        } catch (\Exception $e) {
            // Log the exception or handle it in another way
            \Log::error('Failed to send email: '.$e->getMessage());
        }
        try {
            // Send email notification
            $emailData = [
                'to' => $userfrom->email,
                'subject' => 'Your donation request rejected successfully : ' . $purchase->id,
                'data' => [
                    'name' => $user->name,
                    'message' => 'Your donation request rejected successfully : ' . $purchase->id ,
                ],
            ];
                      
            
            EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
        } catch (\Exception $e) {
            // Log the exception or handle it in another way
            \Log::error('Failed to send email: '.$e->getMessage());
        }
        return response()->json(['message' => 'Purchase cancelled'], 200);
    }

    public function acceptRequest(Request $request, $id)
    {
        $user = Auth::guard('sanctum')->user();
        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }
        $purchase = Purchase::where('id', $id)->first();
        $userfrom=DB::table('users')->where('id', $purchase->Created_by)->first();
        if (!$purchase) {
            return response()->json(['message' => 'Purchase not found'], 404);
        }
    
        $purchase->status = 'accepted';
        $purchase->save();
        try {
            // Send email notification
            $emailData = [
                'to' => $user->email,
                'subject' => 'Donation request accepted successfully : ' . $purchase->id,
                'data' => [
                    'name' => $user->name,
                    'message' => 'Donation request accepted successfully : ' . $purchase->id ,
                ],
            ];
                      
            
            EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
        } catch (\Exception $e) {
            // Log the exception or handle it in another way
            \Log::error('Failed to send email: '.$e->getMessage());
        }
        try {
            // Send email notification
            $emailData = [
                'to' => $userfrom->email,
                'subject' => 'Donation request accepted successfully : ' . $purchase->id,
                'data' => [
                    'name' => $userfrom->name,
                    'message' => 'Donation request accepted successfully : ' . $purchase->id ,
                ],
            ];
                      
            
            EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
        } catch (\Exception $e) {
            // Log the exception or handle it in another way
            \Log::error('Failed to send email: '.$e->getMessage());
        }
        return response()->json(['message' => 'Purchase request accepted'], 200);
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
            if ($event_names) {
                $event_name=$event_names->event_name;
            }
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
