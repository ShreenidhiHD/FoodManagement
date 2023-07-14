<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'id',
        'donation_id',
        'Created_by',
        'status',
        'description',
       
    ];
    public function userPurchases($userId) {
        return $this->where('Created_by', $userId)->get();
    }
    public function userPendingPurchases($userId) {
        return $this->where('Created_by', $userId)
                    ->where('status', 'pending')
                    ->get();
    }
    
    
   
   
}
