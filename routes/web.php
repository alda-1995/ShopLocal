<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\V1\Dashboard\DashboardController;
use App\Http\Controllers\V1\Admin\CategoriaController;
use App\Http\Controllers\V1\Perfil\PerfilController;
use App\Http\Controllers\V1\Post\ServicioController;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/perfil', [PerfilController::class, 'index'])->name('perfil');
Route::prefix('servicios')->group(function () {
    Route::get('/', [ServicioController::class, 'index'])->name('servicios');
});
Route::resource('categorias', CategoriaController::class)->middleware('role_or_permission:admin');
// Route::prefix('perfil')->group(function () {
//     Route::post("created_one_step", [PerfilController::class, 'register_one_step'])->middleware('role_or_permission:vendedor')->name('created_one_step');
// });
Route::get('/login-facebook', function () {
    return Socialite::driver('facebook')->redirect();
});
Route::get('/facebook-callback', function () {
    $user = Socialite::driver('facebook')->user();
    $userExist = User::where('external_id', $user->id)
        ->where('external_auth', 'facebook')->first();
    if ($userExist) {
        Auth::login($userExist);
    } else {
        $userNew = User::create([
            "name" => $user->name,
            "email" => $user->email,
            "avatar" => $user->avatar,
            "external_id" => $user->id,
            "external_auth" => 'facebook'
        ]);
        $userNew->assignRole('vendedor');
        Auth::login($userNew);
    }
    return redirect('/dashboard');
});
Route::get('/login-google', function () {
    return Socialite::driver('google')->redirect();
});
Route::get('/google-callback', function () {
    $user = Socialite::driver('google')->user();
    $userExist = User::where('external_id', $user->id)
        ->where('external_auth', 'google')->first();
    if ($userExist) {
        Auth::login($userExist);
    } else {
        $userNew = User::create([
            "name" => $user->name,
            "email" => $user->email,
            "avatar" => $user->avatar,
            "external_id" => $user->id,
            "external_auth" => 'google'
        ]);
        $userNew->assignRole('vendedor');
        Auth::login($userNew);
    }
    return redirect('/dashboard');
});
