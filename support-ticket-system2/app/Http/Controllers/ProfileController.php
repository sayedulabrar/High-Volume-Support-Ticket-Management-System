<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ProfileController extends Controller
{
    // Get authenticated user's profile
    public function me(Request $request)
    {
        $user = User::with(['roles:id,name'])->findOrFail($request->user()->id);

        return response()->json(['user' => $user], 200);
    }

 
    public function allRoles(){

        $roles = Role::all(['id', 'name']);
        return response()->json([
            'roles' => $roles,
        ], 200);
    }

    
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $request->user()->id,
            'password' => 'nullable|string|min:8|confirmed',
            'current_password' => 'required_with:password|string',
        ]);
    
        $user = $request->user();
    
        // If user wants to update password, validate current password
        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect.',
                ], 403);
            }
            $user->password = Hash::make($request->password);
        }
    
        if ($request->has('name')) {
            $user->name = $request->name;
        }
    
        if ($request->has('email')) {
            $user->email = $request->email;
        }
    
        $user->save();
    
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->only(['id', 'name', 'email'])
        ], 200);
    }
    
}
