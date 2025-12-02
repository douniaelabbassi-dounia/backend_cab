FROM php:8.3-cli

WORKDIR /app

# Dépendances système + extensions PHP
RUN apt-get update && apt-get install -y zip unzip git curl libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

# Copier tout le code (inclut artisan) AVANT composer install
COPY . /app

# Installer composer (si image officielle php)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installer dependances (no-dev pour production)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# Optionnel : exécuter les scripts après (artisan existe déjà)
RUN composer run-script post-autoload-dump || true
RUN php artisan migrate --force || true

# Démarrage
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
