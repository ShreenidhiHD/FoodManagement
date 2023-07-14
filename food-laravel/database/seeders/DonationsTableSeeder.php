<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class DonationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        foreach (range(1,10) as $index) {
            DB::table('donations')->insert([
                'number_of_plates' => $faker->numberBetween($min = 10, $max = 20),
                'location' => $faker->address,
                'delivery_status' => $faker->randomElement($array = array ('delivered','pending')),
                'price' => $faker->randomFloat($nbMaxDecimals = NULL, $min = 0, $max = NULL),
                'expiry_in_days' => $faker->numberBetween($min = 1, $max = 5),
                'food_type' => $faker->randomElement($array = array ('veg','non_veg', 'both')),
                'event_name' => $faker->word,
                'description' => $faker->paragraph($nbSentences = 3, $variableNbSentences = true),
                'prepared_date' => $faker->date($format = 'Y-m-d', $max = 'now'),
                'status' => $faker->randomElement($array = array ('active', 'deactive','expired','completed')),
                'Created_by' => $faker->numberBetween($min = 1, $max = 5),
                'country' => 'India',
                'state' => 'Karnataka',
                'city' => $faker->randomElement($array = array ('Bangalore','Mysore', 'Hubli')),
                'pincode' => $faker->numberBetween($min = 560001, $max = 580120),
            ]);
        }
    }
}