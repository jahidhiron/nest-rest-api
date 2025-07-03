#!/bin/bash

backup_env() {
  local ENV_FILE=$1
  local BACKUP_FOLDER=$2

  if [ -f "$ENV_FILE" ]; then
    set -a
    source <(grep -v '^\s*$' "$ENV_FILE" | sed 's/\r$//')
    set +a
  else
    echo "Environment file '$ENV_FILE' not found."
    return 1
  fi

  mkdir -p backup
  rm -rf "backup/${BACKUP_FOLDER}"

  docker cp "${API_CONTAINER_NAME}:/app/.data" "backup/${BACKUP_FOLDER}"

  echo "Backup complete for $ENV_FILE, saved in backup/${BACKUP_FOLDER}"
}

case "$1" in
  staging)
    backup_env ".env.staging" "stage"
    ;;
  production)
    backup_env ".env.production" "production"
    ;;
  all)
    backup_env ".env.staging" "stage"
    backup_env ".env.production" "production"
    ;;
  *)
    echo "Usage: $0 {staging|production|all}"
    exit 1
    ;;
esac
