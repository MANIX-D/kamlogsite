#!/usr/bin/env bash
# ================================================================
# KAMLOG Backend — Production Deployment Script
# ================================================================
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh              # Full deploy (default)
#   ./deploy.sh --quick      # Skip composer install & migrations
#   ./deploy.sh --rollback   # Rollback last migration batch
# ================================================================

set -euo pipefail

# ── Colors ───────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()   { echo -e "${BLUE}[DEPLOY]${NC} $1"; }
ok()    { echo -e "${GREEN}[  OK  ]${NC} $1"; }
warn()  { echo -e "${YELLOW}[ WARN ]${NC} $1"; }
fail()  { echo -e "${RED}[FAILED]${NC} $1"; exit 1; }

# ── Pre-flight checks ───────────────────────────────────────────
log "Starting KAMLOG production deployment..."

# Ensure we're in the right directory
if [ ! -f "artisan" ]; then
    fail "artisan not found. Run this script from the project root."
fi

# Ensure .env exists
if [ ! -f ".env" ]; then
    fail ".env file not found. Copy .env.production.example to .env and configure it."
fi

# Check APP_ENV
APP_ENV=$(grep -E "^APP_ENV=" .env | cut -d '=' -f2 | tr -d '"' | tr -d ' ')
if [ "$APP_ENV" != "production" ]; then
    warn "APP_ENV is '$APP_ENV', not 'production'. Continuing anyway..."
fi

# Check APP_DEBUG
APP_DEBUG=$(grep -E "^APP_DEBUG=" .env | cut -d '=' -f2 | tr -d '"' | tr -d ' ')
if [ "$APP_DEBUG" = "true" ]; then
    fail "APP_DEBUG is true! Set APP_DEBUG=false for production."
fi

MODE="${1:-full}"

# ── Rollback mode ────────────────────────────────────────────────
if [ "$MODE" = "--rollback" ]; then
    log "Rolling back last migration batch..."
    php artisan migrate:rollback --force
    ok "Rollback complete."
    exit 0
fi

# ── Maintenance mode ON ──────────────────────────────────────────
log "Enabling maintenance mode..."
php artisan down --retry=60 --refresh=15 || true
ok "Maintenance mode enabled."

# ── Dependencies ─────────────────────────────────────────────────
if [ "$MODE" != "--quick" ]; then
    log "Installing composer dependencies (production)..."
    composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
    ok "Composer dependencies installed."
fi

# ── Database migrations ──────────────────────────────────────────
if [ "$MODE" != "--quick" ]; then
    log "Running database migrations..."
    php artisan migrate --force
    ok "Migrations complete."
fi

# ── Laravel optimization suite ───────────────────────────────────
log "Clearing all caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear
php artisan cache:clear
ok "Caches cleared."

log "Building optimization caches..."
php artisan config:cache        # Merges all config into a single cached file
php artisan route:cache         # Compiles routes into a single cached file
php artisan view:cache          # Pre-compiles all Blade views
php artisan event:cache         # Caches event-listener mappings
ok "Optimization caches built."

# ── Storage link ─────────────────────────────────────────────────
log "Ensuring storage symlink exists..."
php artisan storage:link 2>/dev/null || true
ok "Storage link verified."

# ── Queue restart ────────────────────────────────────────────────
log "Restarting queue workers..."
php artisan queue:restart
ok "Queue workers will restart on next cycle."

# ── Maintenance mode OFF ─────────────────────────────────────────
log "Disabling maintenance mode..."
php artisan up
ok "Application is live!"

# ── Summary ──────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Deployment complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  Post-deploy checklist:"
echo "  ✓ config:cache, route:cache, view:cache, event:cache"
echo "  ✓ composer --no-dev --optimize-autoloader"
echo "  ✓ Queue workers restarted"
echo ""
echo "  Manual checks:"
echo "  • Verify: curl -s https://api.kamlog.com/up"
echo "  • Monitor: tail -f storage/logs/laravel-$(date +%Y-%m-%d).log"
echo "  • Queue:   php artisan queue:monitor redis:default --max=100"
echo ""
