<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class HelpersServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $helpersPath = app_path('Helpers');
        
        if (is_dir($helpersPath)) {
            $files = scandir($helpersPath);
            
            foreach ($files as $file) {
                $filePath = $helpersPath . '/' . $file;
                
                if (is_file($filePath) && pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
                    require_once $filePath;
                }
            }
        }
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
