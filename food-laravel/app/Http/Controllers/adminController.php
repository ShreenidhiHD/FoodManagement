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
            ['field' => 'contact', 'headerName' => 'Contact'],
            ['field' => 'country', 'headerName' => 'Country'],
            ['field' => 'state', 'headerName' => 'State'],
            ['field' => 'city', 'headerName' => 'City'],
            ['field' => 'pincode', 'headerName' => 'Pincode'],
            ['field' => 'created_at', 'headerName' => 'Created_at']
        ];

        $donations=DB::table('donations')->get();

        $rows = $donations->map(function($donation) {
            $user_name="";
            $user_contact="";
            $users=DB::table('users')->where('id',$donation->Created_by)->first();
            $user_name=$users->name;
            $user_contact=$users->mobile;
            return [
                'id' => $donation->id,
                'number_of_plates' => $donation->number_of_plates,
                'delivery_status' => ucfirst($donation->delivery_status),
                'price' => $donation->price,
                'expiry_in_days' => $donation->expiry_in_days,
                'prepared_date' => date_format(date_create($donation->prepared_date),'d-m-Y h:m:s a'),
                'status' => ucfirst($donation->status),
                'Created_by' => $user_name,
                'contact'=>$user_contact,
                'country' => ucfirst($donation->country),
                'state' => ucfirst($donation->state),
                'city' => ucfirst($donation->city),
                'pincode' => $donation->pincode,
                'created_at' => date_format(date_create($donation->created_at),'d-m-Y h:m:s a'),
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function get_purchase_by_donations(Request $request,$donation_id){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'donation_id', 'headerName' => 'Donation ID'],
            ['field' => 'event_name', 'headerName' => 'Event Name'],
            ['field' => 'created_by', 'headerName' => 'Created By'],
            ['field' => 'contact', 'headerName' => 'Contact'],
            ['field' => 'status', 'headerName' => 'Status'],
            ['field' => 'description', 'headerName' => 'Description'],
            ['field' => 'created_at', 'headerName' => 'Created_at']
        ];

        $purchases=DB::table('purchases')->where('donation_id',$donation_id)->get();

        $rows = $purchases->map(function($purchase) {
            $event_name = "";
            $event_names = DB::table('donations')->where('id', $purchase->donation_id)->first();
            $event_name = $event_names->event_name;
            $created_by="";
            $contact="";
            $users=DB::table('users')->where('id',$purchase->Created_by)->first();
            $created_by=$users->name;
            $contact=$users->mobile;
            return [
                'id' => $purchase->id,
                'donation_id'=>$purchase->donation_id,
                'event_name' => ucfirst($event_name),
                'created_by'=>ucfirst($created_by),
                'contact'=>$contact,
                'status' => ucfirst($purchase->status),
                'description' => ucfirst($purchase->description),
                'created_at' => date_format(date_create($purchase->created_at),'d-m-Y h:m:s a'),
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function deactivate_user(Request $request,$id){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        //Get donation id
        $donation_ids=DB::table('donation')->where('Created_by',$id)->get();
        $total_rows=count($donation_ids);
        $total_successful_updation=0;
        foreach($donation_ids as $donation_id){
            //Deactivate purchases
            $status_initial=DB::table('purchases')->where(['donation_id'=>$donation_id->id,'status'=>'pending'])->update('status','deactivated');
            if($status_initial){
                //Deactivate donations
                $status_secondary=DB::table('donations')->where(['id'=>$donation_id->id,'status'=>'active'])->update(['status'=>'deactive']);
                if($status_secondary){
                    $total_successful_updation=$total_successful_updation+1;
                }
            }
        }

        if($total_rows==$total_successful_updation){
            $status=DB::table('users')->where(['id'=>$id,'status'=>'active'])->update(['status'=>'deactive']);
            if($status){ return response()->json(['message' => 'User account updated successfully'], 200); }
            else{ return response()->json(['message' => 'Unable to update user! some of users donations and purchases might have affected'], 401); }
        }
        else{ return response()->json(['message' => 'Unable to update the user! some of users donations and purchases might have affected'], 401); }
    }

    public function activate_user(Request $request,$id){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        //Get donation id
        $donation_ids=DB::table('donation')->where('Created_by',$id)->get();
        $total_rows=count($donation_ids);
        $total_successful_updation=0;
        foreach($donation_ids as $donation_id){
            //Activate purchases
            $status_initial=DB::table('purchases')->where(['donation_id'=>$donation_id->id,'status'=>'deactivated'])->update('status','pending');
            if($status_initial){
                //Activate donations
                $status_secondary=DB::table('donations')->where(['id'=>$donation_id->id,'status'=>'deactive'])->update(['status'=>'active']);
                if($status_secondary){
                    $total_successful_updation=$total_successful_updation+1;
                }
            }
        }

        if($total_rows==$total_successful_updation){
            $status=DB::table('users')->where(['id'=>$id,'status'=>'deactive'])->update(['status'=>'active']);
            if($status){ return response()->json(['message' => 'User account updated successfully'], 200); }
            else{ return response()->json(['message' => 'Unable to update user! some of users donations and purchases might have affected'], 401); }
        }
        else{ return response()->json(['message' => 'Unable to update the user! some of users donations and purchases might have affected'], 401); }

    }

    public function deactivate_donation(Request $request,$id){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }
        
        $status_initial=DB::table('purchases')->where(['donation_id'=>$id,'status'=>'pending'])->update('status','deactivated');
        if($status_initial){
            $status=DB::table('donations')->where(['id'=>$id,'status'=>'active'])->update(['status'=>'deactive']);

            if($status){ return response()->json(['message' => 'Donation updated successfully'], 200); }
            else{ 
                DB::table('purchases')->where(['donation_id'=>$id,'status'=>'deactivated'])->update('status','pending');
                return response()->json(['message' => 'Unable to update donation'], 401); 
            }
        }
        else{ return response()->json(['message' => 'Unable to update the donation'], 401); }
    }

    public function activate_donation(Request $request,$id){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $status_initial=DB::table('purchases')->where(['donation_id'=>$id,'status'=>'deactivated'])->update('status','pending');
        if($status_initial){
            $status=DB::table('donations')->where(['id'=>$id,'status'=>'deactive'])->update(['status'=>'active']);

            if($status){ return response()->json(['message' => 'Donation updated successfully'], 200); }
            else{ 
                DB::table('purchases')->where(['donation_id'=>$id,'status'=>'pending'])->update('status','deactivated');
                return response()->json(['message' => 'Unable to update donation'], 401); 
            }
        }
        else{ return response()->json(['message' => 'Unable to update the donation'], 401); }
        
    }

    public function deactivate_purchase(Request $request,$id){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $status=DB::table('purchases')->where(['id'=>$id,'status'=>'pending'])->update(['status'=>'deactivated']);

        if($status){ return response()->json(['message' => 'Purchase updated successfully'], 200); }
        else{ return response()->json(['message' => 'Unable to update purchase'], 401); }
    }

    public function activate_purchase(Request $request,$id){
        $user = Auth::guard('sanctum')->user();

        if(!$user){
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $status=DB::table('purchases')->where(['id'=>$id,'status'=>'deactivated'])->update(['status'=>'pending']);

        if($status){ return response()->json(['message' => 'Purchase updated successfully'], 200); }
        else{ return response()->json(['message' => 'Unable to update purchase'], 401); }
    }
}
