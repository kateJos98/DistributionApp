FROM php:8.1-apache

WORKDIR /var/www/html

COPY . .

RUN docker-php-ext-install pdo pdo_mysql
RUN apt-get update && apt-get install -y git unzip \
 && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer install

EXPOSE 80
