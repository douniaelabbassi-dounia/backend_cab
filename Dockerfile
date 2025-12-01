# Stage 1: build with php 8.3 and composer installed
FROM php:8.3-cli AS build
WORKDIR /app

# install system deps for common php ext and zip, pdo_mysql...
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev \
 && docker-php-ext-install pdo pdo_mysql zip \
 && rm -rf /var/lib/apt/lists/*

# install composer (latest stable)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy composer files and install deps (no dev)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# copy application code
COPY . /app

# Stage 2: runtime image (php 8.3)
FROM php:8.3-cli
WORKDIR /app

# runtime deps
RUN apt-get update && apt-get install -y libzip-dev unzip git \
 && docker-php-ext-install pdo pdo_mysql zip \
 && rm -rf /var/lib/apt/lists/*

# copy app + vendor from build
COPY --from=build /app /app

EXPOSE 8080

CMD ["php","artisan","serve","--host","0.0.0.0","--port","8080"]
