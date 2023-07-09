<?php

namespace App\Http\Controllers;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use App\Helpers\EmailHelper;
use PDOException;

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
    
    public function show($id)
    {
        $donation = Donation::find($id);
    
        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }
    
        return response()->json(['donation' => $donation], 200);
    }
    public function update(Request $request, $id)
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

        // Get the donation from the database
        $donation = Donation::find($id);

        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }

        // Update the donation
        $donation->update($validated);
         
        // Send email notification
        $emailData = [
            'to' => 'shreenidhishree34@gmail.com',
            'subject' => 'Donation Updated',
            'data' => [
                'name' => 'John Doe',
                'message' => 'The donation has been updated. Donation ID: ' . $donation->id,
            ],
        ];
        
        EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
        

        return response()->json([
            'message' => 'Donation updated successfully.',
            'donation' => $donation,
        ], 200);
    }
    
}

