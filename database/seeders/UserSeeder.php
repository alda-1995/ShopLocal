<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'vendedor']);

        $userAdmin = User::create([
            'name' => "Aldair Reyes Sánchez",
            'email' => "aldairreyess04@gmail.com",
            'password' => bcrypt('alda@friper2023'),
        ]);

        $userAdmin->assignRole('admin');
    }
}
