import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: any): any {
    return next.handle().pipe(
      map((data: any) => ({
        success: true,
        message: data?.message || '',
        data: data?.data !== undefined ? data.data : data,
      })),
    );
  }
}
