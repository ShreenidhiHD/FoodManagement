<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Env;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\FoodDonationsController;
use App\Http\Controllers\PurchaseController;
;
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

// Route for user logout, accessible only for authenticated users
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/validate-token',[UserController::class, 'validateToken']);
Route::middleware('auth:sanctum')->get('/user/profile', [UserController::class, 'getProfile']);
Route::middleware('auth:sanctum')->put('/user/profile', [UserController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->put('/user/change-password', [UserController::class, 'changePassword']);
Route::middleware('auth:sanctum')->post('addfood', [FoodDonationsController::class, 'store']);
Route::middleware('auth:sanctum')->get('/user-donations', [FoodDonationsController::class, 'userDonations']);
Route::get('/donations/{id}', [FoodDonationsController::class, 'show'])->middleware('auth:sanctum');
Route::put('/donations/{id}', [FoodDonationsController::class, 'update'])->middleware('auth:sanctum');
// Route to fetch application settings
Route::get('/settings', [SettingsController::class, 'getSettings']);
Route::get('/unittest', [FoodDonationsController::class, 'donation_list']);
Route::get('/test', [PurchaseController::class, 'is_authorised']);