FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libzip-dev \
    libpq-dev \
    libssl-dev \
    librdkafka-dev \
    && docker-php-ext-install pdo pdo_mysql zip \
    && pecl install rdkafka \
    && docker-php-ext-enable rdkafka

WORKDIR /var/www/html

COPY . .

RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer
RUN composer install
RUN composer require vlucas/phpdotenv


RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

EXPOSE 80
