<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function signup(Request $request)
        {
            try {
                $validatedData = $request->validate([
                    'name' => 'required',
                    'email' => 'required|email|unique:users',
                    'password' => 'required|min:8',
                ]);

                // Logging statements
                Log::info('Validated Data:', $validatedData);

                $validatedData['password'] = Hash::make($request->password);

                $user = User::create($validatedData);

                // Create a token for the user
                $token = $user->createToken('authToken')->plainTextToken;

                // Logging statements
                Log::info('User created:', [$user->toArray()]);

                return response()->json(['token' => $token], 201);
            } catch (ValidationException $e) {
                // Logging statement
                Log::error('Validation error:', $e->errors());

                return response()->json(['message' => $e->errors()], 422);
            } catch (\Exception $e) {
                // Logging statement
                Log::error('Exception:', $e->getMessage());

                return response()->json(['message' => 'Signup failed. Please try again.'], 500);
            }
        }

}

