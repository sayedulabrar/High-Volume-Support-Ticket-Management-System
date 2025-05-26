<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    // 1. List all users with their roles
    public function index(Request $request)
    {
        $query = User::with(['roles' => function ($query) {
            $query->select('id', 'name');
        }]);
    
        // Optional filter by role_id
        if ($request->filled('role_id')) {
            $roleId = $request->role_id;
    
            // Filter users who have the given role
            $query->whereHas('roles', function ($q) use ($roleId) {
                $q->where('roles.id', $roleId);
            });
        }
    
        $users = $query->get();
    
        return response()->json(['users' => $users], 200);
    }
    

    // 2. Show user roles data for editing (no view)
    public function edit($id)
    {
        $user = User::with(['roles' => function ($query) {
            $query->select('id', 'name'); // Select 'id' and 'name' only
        }])->findOrFail($id);

        $roles = Role::all(['id', 'name']);
        return response()->json([
            'user' => $user,
            'roles' => $roles,
        ], 200);
    }

    // 3. Update user roles
    public function update(Request $request, $id)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::findOrFail($id);
        $user->syncRoles($request->roles);

        return response()->json(['message' => 'Roles updated successfully.'], 200);
    }
}
