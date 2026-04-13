@echo off
cd apps\backend

echo Scaffolding Prisma Global Module...
call npx nest g module prisma
call npx nest g service prisma

echo Scaffolding Auth Module...
call npx nest g module auth
call npx nest g controller auth
call npx nest g service auth

echo Scaffolding Products Module...
call npx nest g module products
call npx nest g controller products
call npx nest g service products

echo Scaffolding Cart Module...
call npx nest g module cart
call npx nest g controller cart
call npx nest g service cart

echo Scaffolding Orders Module...
call npx nest g module orders
call npx nest g controller orders
call npx nest g service orders

echo Scaffolding Payments Module...
call npx nest g module payments
call npx nest g controller payments
call npx nest g service payments

echo Scaffolding Delivery Module...
call npx nest g module delivery
call npx nest g controller delivery
call npx nest g service delivery

echo Scaffolding Reviews Module...
call npx nest g module reviews
call npx nest g controller reviews
call npx nest g service reviews

echo Scaffolding Notifications Module...
call npx nest g module notifications
call npx nest g controller notifications
call npx nest g service notifications

echo Scaffolding Admin Module...
call npx nest g module admin
call npx nest g controller admin
call npx nest g service admin

echo Scaffolding GST Module...
call npx nest g module gst
call npx nest g service gst

echo Scaffolding complete!
