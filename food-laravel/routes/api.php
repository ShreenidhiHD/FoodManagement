<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Env;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\FoodDonationsController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\adminController;
use App\Http\Controllers\BadgeController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route for user registration
Route::post('/signup', [UserController::class, 'signup']);
// Route for user login
Route::post('/login', [UserController::class, 'login']);
Route::get('/user-role', [UserController::class, 'userrole'])->middleware('auth:sanctum');
// Route for user logout, accessible only for authenticated users
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user/is-profile-complete', [UserController::class, 'isProfileComplete'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/validate-token',[UserController::class, 'validateToken']);
Route::middleware('auth:sanctum')->get('/user/profile', [UserController::class, 'getProfile']);
Route::middleware('auth:sanctum')->put('/user/profile', [UserController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->put('/user/change-password', [UserController::class, 'changePassword']);
Route::middleware('auth:sanctum')->post('addfood', [FoodDonationsController::class, 'store']);
Route::middleware('auth:sanctum')->get('/user-donations', [FoodDonationsController::class, 'userDonations']);
Route::get('/donations/{id}', [FoodDonationsController::class, 'show'])->middleware('auth:sanctum');
Route::put('/donations/{id}', [FoodDonationsController::class, 'update'])->middleware('auth:sanctum');
Route::post('/purchase/requests', [PurchaseController::class, 'create'])->middleware('auth:sanctum');
Route::get('/purchase/requests/cancel/{id}', [PurchaseController::class, 'deletes'])->middleware('auth:sanctum');
Route::get('/user-purchases', [PurchaseController::class, 'purchase_list'])->middleware('auth:sanctum');
Route::get('/user-requests', [PurchaseController::class, 'userPendingPurchases'])->middleware('auth:sanctum');
Route::get('/donations/requests/{id}', [PurchaseController::class, 'user_donation_request'])->middleware('auth:sanctum');
Route::get('/purchase/requests_cancel/{id}', [PurchaseController::class, 'cancelRequest'])->middleware('auth:sanctum');
Route::get('/purchase/requests_accept/{id}', [PurchaseController::class, 'acceptRequest'])->middleware('auth:sanctum');
//Admin routes
Route::get('/admin/users', [adminController::class, 'users'])->middleware('auth:sanctum');
Route::get('/admin/donations', [adminController::class, 'donations'])->middleware('auth:sanctum');
Route::get('/purchases_by_donation/{donation_id}', [adminController::class, 'get_purchase_by_donations'])->middleware('auth:sanctum');
Route::get('/user-deactivate/{id}', [adminController::class, 'deactivate_user'])->middleware('auth:sanctum');
Route::get('/user-activate/{id}', [adminController::class, 'activate_user'])->middleware('auth:sanctum');
Route::get('/donation-deactivate/{id}', [adminController::class, 'deactivate_donation'])->middleware('auth:sanctum');
Route::get('/donation-activate/{id}', [adminController::class, 'activate_donation'])->middleware('auth:sanctum');
Route::get('/purchase-deactivate/{id}', [adminController::class, 'deactivate_purchase'])->middleware('auth:sanctum');
Route::get('/purchase-activate/{id}', [adminController::class, 'activate_purchase'])->middleware('auth:sanctum');

Route::post('/create_charity', [adminController::class, 'create_charity_account'])->middleware('auth:sanctum');
Route::post('/admin_password_change', [adminController::class, 'changePassword'])->middleware('auth:sanctum');

Route::get('/admin/verify_user/{id}', [adminController::class, 'verify_user'])->middleware('auth:sanctum');
Route::get('/admin/unverify_user/{id}', [adminController::class, 'unverify_user'])->middleware('auth:sanctum');


Route::post('/reset-password', [UserController::class, 'resetPassword']);

//Route for badges of user dashboard
Route::get('/badge/my_donation', [BadgeController::class, 'my_donation_badge'])->middleware('auth:sanctum');
Route::get('/badge/my_purchase', [BadgeController::class, 'my_purchases_badge'])->middleware('auth:sanctum');
Route::get('/badge/my_request', [BadgeController::class, 'my_request_badge'])->middleware('auth:sanctum');
Route::get('/badge/request', [BadgeController::class, 'request_badge'])->middleware('auth:sanctum');

//Check for admin account
Route::get('/check_admin', [UserController::class, 'check_admin']);
Route::get('/create_admin', [UserController::class, 'create_admin']);

// Route to fetch application settings
Route::get('/test/re', [FoodDonationsController::class, 'donation_list'])->middleware('auth:sanctum');
Route::get('/settings', [SettingsController::class, 'getSettings']);
Route::get('/unittest', [FoodDonationsController::class, 'donation_list']);
Route::get('/validate-token', [UserController::class, 'validateToken'])->middleware('auth:sanctum');
