# India E-Commerce API Contract

This document outlines the REST API structure for the NestJS backend, following best practices for Indian market e-commerce (GST, Razorpay, OTP Auth).

## 1. Authentication (Mobile OTP First)
All protected routes require a Bearer JWT `Authorization: Bearer <token>`.

| Method | Endpoint | Description | Payload / Query | Response |
|--|--|--|--|--|
| POST | `/api/auth/send-otp` | Send Mobile OTP | `{ "mobile": "+919876543210" }` | `{ "message": "OTP sent", "referenceId": "xyz" }` |
| POST | `/api/auth/verify-otp` | Verify OTP | `{ "mobile": "+...", "otp": "123456", "referenceId": "xyz" }` | `{ "accessToken": "...", "refreshToken": "..." }` |
| POST | `/api/auth/refresh` | Refresh JWT Token | `{ "refreshToken": "..." }` | `{ "accessToken": "..." }` |
| POST | `/api/auth/logout` | Revoke tokens | None | `200 OK` |

## 2. Products & Catalog

| Method | Endpoint | Description | Payload / Query | Response |
|--|--|--|--|--|
| GET | `/api/products` | Paginated product list | `?page=1&limit=20&cat=electronics&sort=price_asc` | `{ "data": [Product], "meta": {...} }` |
| GET | `/api/products/:slug` | Get full product detail | None | `Product` object with `ProductVariant`s |
| GET | `/api/products/search` | Search by query | `?q=iphone` | `[Product]` |
| GET | `/api/categories` | Get category tree | None | `[Category]` (nested) |

## 3. Cart & Checkout

| Method | Endpoint | Description | Payload / Query | Response |
|--|--|--|--|--|
| GET | `/api/cart` | Get cart details | Header `X-Guest-UUID` (if not logged in) | `Cart` with computed totals and GST breakdown |
| POST | `/api/cart` | Add / update item | `{ "variantId": "...", "qty": 1 }` | `200 OK Cart` |
| DELETE | `/api/cart/:variantId` | Remove item | None | `200 OK Cart` |
| POST | `/api/cart/coupon` | Apply promo code | `{ "code": "FESTIVAL50" }` | `Cart` with discount |
| GET | `/api/delivery/check` | Check PIN code | `?pin=400001` | `{ "serviceable": true, "codAvailable": true, "eta": "2-3 days" }` |

## 4. Orders & Payments

| Method | Endpoint | Description | Payload / Query | Response |
|--|--|--|--|--|
| POST | `/api/orders` | Create Razorpay Order | `{ "addressId": "..." }` | `{ "orderId": "ORD_01", "razorpayOrderId": "order_xyz", "amount": 149900 }` |
| POST | `/api/orders/cod` | Confirm COD Order | `{ "addressId": "..." }` | `{ "orderId": "ORD_02", "status": "CONFIRMED" }` |
| POST | `/api/payments/webhook` | Razorpay Callback | Razorpay Webhook Body | `200 OK` |
| GET | `/api/orders/my` | User's order history | None | `[Order]` |
| GET | `/api/orders/:id` | Single order tracking | None | `Order` with `Address`, `Items` |
| POST | `/api/orders/:id/cancel` | Cancel order | `{ "reason": "..." }` | `200 OK` |

## 5. Addresses & Profile

| Method | Endpoint | Description | Payload / Query | Response |
|--|--|--|--|--|
| GET | `/api/profile` | Get current user | None | `User` |
| PATCH | `/api/profile` | Update profile | `{ "name": "...", "gstin": "..." }` | `User` |
| GET | `/api/addresses` | List addresses | None | `[Address]` |
| POST | `/api/addresses` | Add new address | `{ "pin_code": "...", "street": "..." }` | `Address` |
| PUT | `/api/addresses/:id` | Update address | `{ "is_default": true }` | `Address` |

## 6. Admin Panel

*Requires generic Admin access. Endpoints must be protected globally by `RolesGuard`.*

| Method | Endpoint | Description |
|--|--|--|
| GET | `/api/admin/dashboard` | KPI Metrics (GMV, orders, users) |
| GET | `/api/admin/orders` | List all orders with filters |
| PATCH | `/api/admin/orders/:id/status`| Update status (e.g. `SHIPPED` + AWB assignment) |
| GET | `/api/admin/reports/gst` | CSV Export of GSTR-1 data |
| POST | `/api/admin/products` | Create a new product |
| PATCH | `/api/admin/products/:id` | Update product / variants |

## Error Responses
Consistent error formatting across all APIs:
```json
{
  "statusCode": 400,
  "message": ["qty must be a positive number"],
  "error": "Bad Request"
}
```
*Note: All currency responses are returned as `paise` (integers) to prevent floating-point calculation errors. Frontend must divide by 100 before displaying.*
