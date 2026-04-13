import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { GstModule } from './gst/gst.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, CartModule, OrdersModule, PaymentsModule, DeliveryModule, ReviewsModule, NotificationsModule, AdminModule, GstModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
