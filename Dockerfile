# stage 1: build with composer (has composer preinstalled)
FROM composer:2 AS build
WORKDIR /app

# Copy composer files first for caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Copy the rest of the app
COPY . /app

# stage 2: runtime
FROM php:8.3-cli
WORKDIR /app

# needed system deps for pdo_mysql, zip, etc.
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git \
 && docker-php-ext-install pdo pdo_mysql zip \
 && rm -rf /var/lib/apt/lists/*

# copy built vendor
COPY --from=build /app /app

# expose port (Railway maps 8080)
EXPOSE 8080

# run artisan serve (simple). If you use nginx/fpm use another setup.
CMD ["php","artisan","serve","--host","0.0.0.0","--port","8080"]
