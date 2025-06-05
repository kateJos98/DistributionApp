<?php
namespace App\models;

class Customer {
    public $name;
    public $email;
    public $phone;

    public function __construct($data) {
        $this->name = $data['name'];
        $this->email = $data['email'];
        $this->phone = $data['phone'];
    }
}
