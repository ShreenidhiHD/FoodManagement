<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use PDOException;


class UserController extends Controller
{
    //Signup function
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

        //Logging statement
        public function login(Request $request)
        {
            //try to login first with email and password
            try {
                $request->validate([
                    'email' => 'required|email',
                    'password' => 'required',
                ]);
        
                $user = User::where('email', $request->email)->first();
        
                if (!$user || !Hash::check($request->password, $user->password)) {
                    return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
                }
        
                $token = $user->createToken('authToken')->plainTextToken;
        
                return response()->json(['token' => $token], 201);
            } 
            catch (QueryException $e) {
                return response()->json(['message' => $e->getMessage()], 400);
            }
            catch (PDOException $e) {
                Log::error('Database connection error:', $e->getMessage());   //databse connection error
                return response()->json(['message' => 'Database connection failed. Please try again later.'], 503);
            } catch (ValidationException $e) {
                Log::error('Validation error:', $e->errors());    //validation error
                return response()->json(['message' => $e->errors()], 422);
            } catch (\Exception $e) {
                Log::error('Exception:', $e->getMessage()); //exception 
                return response()->json(['message' => 'Login failed. Please try again.'], 500);
            }
        }        
}

