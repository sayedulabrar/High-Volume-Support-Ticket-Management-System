<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        $permissions = [
            'create tickets',
            'reply to tickets',
            'assign tickets',
            'view all tickets',
            'manage users',
            'manage roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $agent = Role::firstOrCreate(['name' => 'Support Agent']);
        $customer = Role::firstOrCreate(['name' => 'Customer']);

        // Assign permissions
        $admin->syncPermissions($permissions);
        $agent->syncPermissions(['reply to tickets']);
        $customer->syncPermissions(['create tickets', 'reply to tickets']);

        // Create default Admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'sayedulabrar14045@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'), // Change this in production!
            ]
        );
        $adminUser->assignRole('Admin');

        // Create Support Agent user
        $agentUser = User::firstOrCreate(
            ['email' => 'modasayedul@gmail.com'],
            [
                'name' => 'Support Agent User',
                'password' => Hash::make('password'), // Change this in production!
            ]
        );
        $agentUser->assignRole('Support Agent');

        // Create Customer user
        $customerUser = User::firstOrCreate(
            ['email' => 'munemshahriar13@gmail.com'],
            [
                'name' => 'Customer User',
                'password' => Hash::make('password'), // Change this in production!
            ]
        );
        $customerUser->assignRole('Customer');
    }
}
