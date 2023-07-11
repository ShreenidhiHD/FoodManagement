<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Auth;

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Purchase;
use App\Models\Donation;
use Illuminate\Support\Facades\Auth;

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

    // Function to handle purchase cancellation
    public function cancelPurchase(Request $request, $id)
    {
        $purchase = Purchase::where('id', $id)
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
}
