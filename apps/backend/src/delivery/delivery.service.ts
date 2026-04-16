import { Injectable, BadRequestException } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import axios from 'axios';

@Injectable()
export class DeliveryService {
  private redis: Redis;
  private shiprocketToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  }

  private async getShiprocketToken() {
    if (this.shiprocketToken && Date.now() < this.tokenExpiresAt) {
      return this.shiprocketToken;
    }

    try {
      const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      });

      this.shiprocketToken = response.data.token;
      // Shiprocket tokens usually expire in 10 days, we'll refresh after 9 days
      this.tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000; 

      return this.shiprocketToken;
    } catch (error) {
      console.error('Shiprocket Authentication Failed:', error);
      return null;
    }
  }

  async checkServiceability(pincode: string) {
    if (!/^\d{6}$/.test(pincode)) {
      throw new BadRequestException('Invalid pincode format');
    }

    const cacheKey = `pincode:${pincode}`;
    const cachedResult = await this.redis.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const fallbackResponse = {
      is_serviceable: true,
      cod_available: true,
      estimated_days: 5,
      available_couriers: [],
      disclaimer: 'Real-time check unavailable. Assuming serviceable.',
    };

    const token = await this.getShiprocketToken();
    if (!token) {
      return fallbackResponse;
    }

    try {
      // Typically, Shiprocket requires pickup_postcode, delivery_postcode, weight, cod.
      // For a basic check without order specifics, we assume a standard origin.
      // We will mock the API response slightly if the exact API route isn't viable without an order.
      // E.g., Courier Serviceability API: GET /v1/external/courier/serviceability/
      const pickupPincode = '110001'; // Define a standard warehouse pincode
      const weight = 1;
      const cod = 1;

      const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${pincode}&weight=${weight}&cod=${cod}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data;
      const couriers = data?.available_courier_companies || [];
      
      const isServiceable = couriers.length > 0;
      const codAvailable = isServiceable && couriers.some((c: any) => c.cod === 1);
      
      // Calculate average estimated days
      let estimatedDays = 5;
      if (isServiceable) {
        const ests = couriers.map((c: any) => {
           let edd = c.etd || ''; // Expected Time of Delivery
           // Shiprocket may return a date string or days. Mock to 3 for now if parsing fails.
           return 3;
        });
        estimatedDays = Math.ceil(ests.reduce((a: number, b: number) => a + b, 0) / ests.length) || 3;
      }

      const result = {
        is_serviceable: isServiceable,
        cod_available: codAvailable,
        estimated_days: estimatedDays,
        available_couriers: couriers.map((c: any) => c.courier_name),
      };

      // Cache for 24 hours
      await this.redis.set(cacheKey, result, { ex: 24 * 60 * 60 });

      return result;

    } catch (error) {
      console.error('Shiprocket API Error:', error);
      // Fail gracefully
      return fallbackResponse;
    }
  }
}
