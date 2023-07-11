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
    // //Check if user is authorised to perform operations
    // function is_authorised(){
    //     $user = $request->user();
    // }

    // //CRUD Operations
    // function create(Request $request){
        
    // }

    // function read(){}

    // function update(Request $request){}

    // function delete($id){}

    
    // Check if user is authorised to perform operations
    public function is_authorised(Request $request) {
        $user = $request->user();
    }

    // Function to handle purchase creation
    public function createPurchase(Request $request) {
        $user = $request->user();
        $purchase = new Purchase;
        $purchase->donation_id = $request->donation_id;
        $purchase->Crated_by = $user->id;
        $purchase->status = 'pending';
        $purchase->description = $request->description;
        $purchase->save();

        return response()->json(['message' => 'Request successful'], 200);
    }

    // Function to handle purchase cancellation
    public function cancelPurchase(Request $request, $id) {
        $purchase = Purchase::findOrFail($id);
        $purchase->status = 'cancelled';
        $purchase->save();

        return response()->json(['message' => 'Purchase cancelled'], 200);
    }
    
    // CRUD Operations
    function create(Request $request){
        $this->is_authorised($request);
        $this->createPurchase($request);
    }

    function read(){}

    function update(Request $request){}

    function delete(Request $request, $id){
        $this->is_authorised($request);
        $this->cancelPurchase($request, $id);
    }
}
