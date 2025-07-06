FROM php:8.2-apache

# Habilita mod_rewrite
RUN a2enmod rewrite

# Instala librerías necesarias y extensiones
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    librdkafka-dev \
    git \
    && pecl install rdkafka \
    && docker-php-ext-enable rdkafka \
    && docker-php-ext-install zip pdo pdo_mysql

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copia el código
COPY . /var/www/html

RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf


# Establece directorio de trabajo
WORKDIR /var/www/html

# Instala dependencias PHP
RUN composer install

EXPOSE 80
