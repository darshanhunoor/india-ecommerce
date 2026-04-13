@echo off
mkdir apps 2>nul
mkdir packages 2>nul
call npx -y create-next-app@14 ./apps/frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
call npx -y @nestjs/cli new apps/backend --package-manager npm --strict --skip-git
