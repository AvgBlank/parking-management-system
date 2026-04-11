#!/usr/bin/env bash

# =============================================================================
#  Parking Management System — Setup Script
# =============================================================================
#  Usage:
#    ./setup.sh          → install deps, setup DB, copy .env files
#    ./setup.sh --dev    → ...then start the development server  (bun dev)
#    ./setup.sh --prod   → ...then start the production server   (bun start)
# =============================================================================

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}${BOLD}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}${BOLD}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}${BOLD}[ERROR]${RESET} $*" >&2; }
die()     { error "$*"; exit 1; }

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${CYAN}║     Parking Management System — Setup Script     ║${RESET}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${RESET}"
echo ""

# ── Argument parsing ──────────────────────────────────────────────────────────
START_MODE=""
for arg in "$@"; do
  case "$arg" in
    --dev|-d)  START_MODE="dev"  ;;
    --prod|-p) START_MODE="prod" ;;
    --help|-h)
      echo "Usage: $0 [--dev | --prod]"
      echo ""
      echo "  (no flag)   Set up the project without starting any server"
      echo "  --dev, -d   Set up, then run the development server  (bun dev)"
      echo "  --prod, -p  Set up, then run the production server   (bun start)"
      exit 0
      ;;
    *) die "Unknown argument: $arg. Use --help for usage." ;;
  esac
done

# ── Step 1: Prerequisite checks ───────────────────────────────────────────────
echo -e "${BOLD}Step 1 — Checking required software${RESET}"
echo "────────────────────────────────────────────────────"

# Bun
if ! command -v bun &>/dev/null; then
  die "Bun is not installed or not in PATH.\n       Install it from: https://bun.sh"
fi
BUN_VERSION=$(bun --version)
success "Bun found  (v${BUN_VERSION})"

# Docker
if ! command -v docker &>/dev/null; then
  die "Docker is not installed or not in PATH.\n       Install it from: https://docs.docker.com/get-docker/"
fi
DOCKER_VERSION=$(docker --version | sed 's/Docker version //' | sed 's/,.*//')
success "Docker found  (v${DOCKER_VERSION})"

# Docker daemon running?
if ! docker info &>/dev/null 2>&1; then
  die "Docker daemon is not running. Please start Docker and try again."
fi
success "Docker daemon is running"

# Docker Compose (plugin)
if ! docker compose version &>/dev/null 2>&1; then
  die "Docker Compose plugin is not installed.\n       Install it from: https://docs.docker.com/compose/install/"
fi
COMPOSE_VERSION=$(docker compose version --short 2>/dev/null || docker compose version | grep -oP '[\d]+\.[\d]+\.[\d]+' | head -1)
success "Docker Compose found  (v${COMPOSE_VERSION})"
echo ""

# ── Step 2: Environment files ─────────────────────────────────────────────────
echo -e "${BOLD}Step 2 — Copying environment files${RESET}"
echo "────────────────────────────────────────────────────"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

copy_env() {
  local app_path="$1"
  local label="$2"

  if [[ -f "${app_path}/.env" ]]; then
    warn "${label}/.env already exists — skipping (delete it manually to reset)"
  else
    cp "${app_path}/.env.example" "${app_path}/.env"
    success "Created ${label}/.env from .env.example"
  fi
}

copy_env "${ROOT_DIR}/apps/api" "apps/api"
copy_env "${ROOT_DIR}/apps/web" "apps/web"
echo ""

# ── Step 3: Install dependencies ──────────────────────────────────────────────
echo -e "${BOLD}Step 3 — Installing dependencies${RESET}"
echo "────────────────────────────────────────────────────"
info "Running bun install in the monorepo root…"
bun install
success "Dependencies installed"
echo ""

# ── Step 4: Database setup via Docker ────────────────────────────────────────
echo -e "${BOLD}Step 4 — Setting up the database (Docker)${RESET}"
echo "────────────────────────────────────────────────────"

info "Starting the 'db' service with Docker Compose (profile: localdb)…"
docker compose --profile localdb up -d db

# Wait until the healthcheck passes
info "Waiting for PostgreSQL to become healthy…"
TIMEOUT=30
ELAPSED=0
until docker compose ps db --format '{{.Health}}' 2>/dev/null | grep -q "healthy"; do
  if [[ $ELAPSED -ge $TIMEOUT ]]; then
    die "Timed out waiting for the database to become healthy after ${TIMEOUT}s."
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
  info "  Still waiting… (${ELAPSED}s / ${TIMEOUT}s)"
done
success "PostgreSQL is healthy and ready"

# Run Prisma migrations
info "Running database migrations (prisma migrate deploy)…"
bun run db:migrate:deploy -- --ui=stream-with-experimental-timestamps
success "Database migrations applied"
echo ""

# ── Done ──────────────────────────────────────────────────────────────────────
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}${BOLD}║           Setup completed successfully!          ║${RESET}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════╝${RESET}"
echo ""

if [[ -z "$START_MODE" ]]; then
  echo -e "  Run  ${BOLD}./setup.sh --dev${RESET}   to start the development server"
  echo -e "  Run  ${BOLD}./setup.sh --prod${RESET}  to start the production server"
  echo ""
  exit 0
fi

# ── Step 5: Start server ──────────────────────────────────────────────────────
if [[ "$START_MODE" == "dev" ]]; then
  echo -e "${BOLD}Step 5 — Starting development server${RESET}"
  echo "────────────────────────────────────────────────────"
  info "Running bun dev…"
  exec bun run dev
elif [[ "$START_MODE" == "prod" ]]; then
  echo -e "${BOLD}Step 5 — Starting production server${RESET}"
  echo "────────────────────────────────────────────────────"
  info "Running bun start…"
  exec bun run start
fi
