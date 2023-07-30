<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDonationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->integer('number_of_plates');
            $table->string('location');
            $table->string('delivery_status');
            $table->integer('expiry_in_days');
            $table->enum('food_type', ['veg', 'non_veg', 'both']);
            $table->string('event_name');
            $table->text('description');
            $table->date('prepared_date')->default(now());
            $table->timestamps();
            $table->enum('status',['active', 'deactive','expired','completed','hidden'])->default('active');
            $table->integer('Created_by');
            $table->text('country');
            $table->text('state');
            $table->text('city');
            $table->integer('pincode');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('donations');
    }
}
