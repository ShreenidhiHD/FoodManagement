<?php

namespace App\Http\Controllers;
use App\Models\Donation;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use App\Helpers\EmailHelper;
use PDOException;
use DB;
use Auth;

class FoodDonationsController extends Controller
{
    /**
     * Handle the incoming food donation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validation...
        
        $validated = $request->validate([
            'number_of_plates' => 'required|integer',
            'location' => 'required|string',
            'delivery_status' => 'required|string',
            'price' => 'required|numeric',
            'expiry_in_days' => 'required|integer',
            'food_type' => 'required|string',
            'event_name' => 'required|string',
            'description' => 'required|string',
            'prepared_date' => 'required|date',
            'status' => 'required|string',
            'country' => 'required|string',
            'city' => 'required|string',
            'pincode' =>'required| integer',
            'state' => 'required| string',
        ]);
    
        // Get the authenticated user
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        // Adding the authenticated user's ID as the 'Created_by' field
        $validated['Created_by'] = $user->id;
    
        // Create new Donation
        $donation = Donation::create($validated);
        try {
            // Send email notification
            $emailData = [
                'to' => $user->email,
                'subject' => 'Donation Entry Created for: ' . $donation->event_name,
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
        // Return a response...
        return response()->json([
            'message' => 'Food donation created successfully.',
            'donation' => $donation, // Optional: Include the created donation in the response
        ], 200);
    }

    public function userDonations(Request $request) {
        // Sanctum provides a handy way to get the authenticated user
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $donations = (new Donation)->userDonations($user->id);
    
        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'event_name', 'headerName' => 'Event Name'],
            ['field' => 'prepared_date', 'headerName' => 'Prepared Date'],
            ['field' => 'status', 'headerName' => 'Status']
        ];
        
        $rows = $donations->map(function($donation) {
            return [
                'id' => $donation->id,
                'event_name' => $donation->event_name,
                'prepared_date' => $donation->prepared_date,
                'status' => $donation->status,

            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    //Get user details
    public function get_user_details_by_userid($id){
        $user_array=Array();
        //Fetch from users table
        $users = DB::table('users')->where('id',$id)->get();;
        foreach($users as $user){
            if($user->status!='deactived'){
                //Assigning to array
                $user_array['user_id']=$user->id;
                $user_array['user_name']=$user->name;
                $user_array['user_status']=$user->status;
                ($user->status=='verified')?$user_array['is_verified']=true:$user_array['is_verified']=false;
            }
        }
        return $user_array;
    }

    public function update_donation_status($id){
        $status=DB::table('donations')->where('id',$id)->update(['status'=>'expired']);
        if($status){
            return true;
        }
        else{
            return false;
        }
    }
    
    public function donation_list(Request $request)
    {
        $donations_list = [];
        $donations = Donation::get();
    
        foreach ($donations as $donation) {
            $temp = [];
            $user = $this->get_user_details_by_userid($donation['Created_by']);
            $user_status = $user['user_status'] ?? 'default_status';

            $expiry_date=date_add(date_create($donation['prepared_date']),date_interval_create_from_date_string($donation['expiry_in_days']." days"));
            $today=date('Y-m-d');
            if($expiry_date<date_create($today)){ $this->update_donation_status($donation['id']); }
    
            if ($user_status != 'deactived' && $donation['status'] == 'active') {
                if (is_array($user) && count($user) > 0) {
                    $temp['userid'] = $user['user_id'];
                    $temp['username'] = $user['user_name'];
                    $temp['verified'] = $user['is_verified'];
                }
                $temp['id'] = $donation['id'];
                $temp['number_of_plates'] = $donation['number_of_plates'];
                $temp['location'] = ucfirst($donation['location']);
                $temp['delivery_status'] = ucfirst($donation['delivery_status']);
                $temp['price'] = number_format($donation['price'], 2);
                $temp['expiry_in_days'] = $donation['expiry_in_days'] . " Days";
                $temp['food_type'] = ucfirst($donation['food_type']);
                $temp['event_name'] = ucfirst($donation['event_name']);
                $temp['description'] = ucfirst($donation['description']);
                $temp['prepared_date'] = date_format(date_create($donation['prepared_date']), 'd-m-Y');
                $temp['created_at'] = date_format(date_create($donation['created_at']), 'd-m-Y');
                $temp['country'] = ucfirst($donation['country']);
                $temp['state'] = ucfirst($donation['state']);
                $temp['city'] = ucfirst($donation['city']);
                $temp['pincode'] = $donation['pincode'];
    
                if ($donation['Created_by'] == auth()->id()) {
                    $temp['buttonStatus'] = 'donater';
                } else {
                    $purchase = Purchase::where('donation_id', $donation['id'])
                        ->where('Created_by', auth()->id())
                        ->latest() // get the latest purchase by this user for this donation
                        ->first();
                    
                    if ($purchase) {
                        if($purchase->status == 'accepted'){
                            $temp['buttonStatus'] = 'accepted';
                        }
                        else if ($purchase->status == 'rejected') {
                            $temp['buttonStatus'] = 'request';
                        } 
                        else if ($purchase->status == 'cancelled') {
                            $temp['buttonStatus'] = 'request';
                        } 
                        else if ($purchase->status == 'expired') {
                            $temp['buttonStatus'] = 'Expired';
                        }  
                        else if ($purchase->status == 'completed') {
                            $temp['buttonStatus'] = 'completed';
                        } 
                        else {
                            $temp['buttonStatus'] = 'cancel';
                        }
                    } else {
                        $temp['buttonStatus'] = 'noentry';
                    }
                }
                array_push($donations_list, $temp);
            }
        }
    
        return response()->json(['donation' => $donations_list], 200);
    }
    
    
    

    public function show($id)
{
    $donation = Donation::find($id);

    if (!$donation) {
        return response()->json(['message' => 'Donation not found'], 404);
    }

    if ($donation->status === 'deactive') {
        return response()->json(['message' => 'This donation is currently deactivated'], 403);
    }

    return response()->json(['donation' => $donation], 200);
}

    public function update(Request $request, $id)
    {
        // Validation...
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
        $donation = Donation::find($id);
        if ($donation->status === 'deactive') {
            return response()->json(['message' => 'This donation is currently deactivated'], 403);
        }
        $validated = $request->validate([
            'number_of_plates' => 'required|integer',
            'location' => 'required|string',
            'delivery_status' => 'required|string',
            'price' => 'required|numeric',
            'expiry_in_days' => 'required|integer',
            'food_type' => 'required|string',
            'event_name' => 'required|string',
            'description' => 'required|string',
            'prepared_date' => 'required|date',
            'status' => 'required|string',
            'country' => 'required|string',
            'city' => 'required|string',
            'pincode' =>'required| integer',
            'state' => 'required| string',
        ]);

        // Get the donation from the database
        $donation = Donation::find($id);
        $user = User::find($donation->Created_by);


        // Update the donation
        $donation->update($validated);
         
        try {
            // Send email notification
            $emailData = [
                'to' => $user->email,
                'subject' => 'Your Donation Entry for ' . $donation->event_name . ' Has Been Updated',
                'data' => [
                    'name' => $user->name,
                    'message' => 'You have successfully updated your donation entry for the event <b>'. $donation->event_name . '</b> at '. $donation->updated_at . ' <b>' . $donation->updated_at . '</b>. Your updated donation contributes significantly to our effort to reduce food waste. The reference for your updated donation is: <b>' . $donation->id . '</b>',
                ],
            ];
              
            
            EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
        } catch (\Exception $e) {
            // Log the exception or handle it in another way
            \Log::error('Failed to send email: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Donation updated successfully.',
            'donation' => $donation,
        ], 200);
    }
    
}
