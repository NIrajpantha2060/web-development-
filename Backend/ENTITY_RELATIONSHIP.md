# Lift Nepal - Sequelize Entity Relationship Diagram

## 📦 ENTITIES & RESPONSIBILITIES

### 1. **USER** (Primary Entity)
**Table:** `users`

| Field | Type | Responsibility |
|-------|------|----------------|
| `id` | INTEGER (PK) | Unique identifier |
| `username` | STRING(30) | Display name |
| `phone` | STRING(10) | Nepal phone (97/98) - unique login |
| `email` | STRING | Email address - unique |
| `password` | STRING | Hashed password |
| `role` | STRING(20) | `'user'` or `'admin'` |
| `profilePicture` | STRING(255) | Profile image URL |
| `isVerifiedUser` | BOOLEAN | Citizenship verified (green tick) |
| `isVerifiedRider` | BOOLEAN | Driving license verified (purple tick) |
| `mpin` | STRING(255) | Hashed 4-digit payment PIN |
| `hasMpinSetup` | BOOLEAN | MPIN setup status |
| `paymentMethod` | STRING(30) | Default payment method |
| `hasPaymentSetup` | BOOLEAN | Payment info setup status |
| `cardLastFour` | STRING(4) | Last 4 digits of debit card |
| `cardHolderName` | STRING(100) | Name on card |
| `cardExpiry` | STRING(5) | Card expiry (MM/YY) |
| `cardBrand` | STRING(20) | Visa/Mastercard/etc. |

**Responsibilities:** Authentication, authorization, profile management, payment setup, verification status tracking

---

### 2. **VEHICLE** 
**Table:** `vehicles`

| Field | Type | Responsibility |
|-------|------|----------------|
| `id` | INTEGER (PK) | Unique identifier |
| `vehicleNumber` | STRING(30) | Plate number |
| `vehicleType` | STRING(20) | `'bike'` or `'car'` |
| `vehiclePhoto` | STRING(255) | Vehicle image URL |
| `vehicleBrand` | STRING(50) | e.g., Toyota, Honda |
| `vehicleModel` | STRING(50) | e.g., Corolla, Civic |
| `userId` | INTEGER (FK) | Owner (UNIQUE - 1:1 with User) |

**Responsibilities:** Store vehicle details for riders, one vehicle per user

---

### 3. **RIDE**
**Table:** `rides`

| Field | Type | Responsibility |
|-------|------|----------------|
| `id` | INTEGER (PK) | Unique identifier |
| `from` | STRING(30) | Origin location |
| `to` | STRING(30) | Destination location |
| `date` | DATEONLY | Travel date |
| `time` | TIME | Departure time |
| `pickupLocation` | STRING(30) | Pickup point |
| `vehicleNumber` | STRING(30) | Vehicle plate |
| `vehiclePhoto` | STRING(255) | Vehicle image |
| `vehicleType` | STRING(20) | `'bike'` or `'car'` |
| `description` | STRING(400) | Ride details |
| `price` | DECIMAL(10,2) | Price per seat (NPR) |
| `availableSeats` | INTEGER | Total seats (1-10) |
| `status` | STRING(20) | `'active'`, `'cancelled'`, `'completed'`, `'taken'` |
| `bookedSeats` | INTEGER | Already booked seats |
| `userId` | INTEGER (FK) | Rider (owner) |

**Responsibilities:** Represent ride offers, manage seat availability, track ride status

---

### 4. **RIDEBOOKING**
**Table:** `ride_bookings`

| Field | Type | Responsibility |
|-------|------|----------------|
| `id` | INTEGER (PK) | Unique identifier |
| `rideId` | INTEGER (FK) | Referenced ride |
| `passengerId` | INTEGER (FK) | Booking user |
| `seatsBooked` | INTEGER | Number of seats |
| `totalAmount` | DECIMAL(10,2) | Payment amount (NPR) |
| `paymentMethod` | STRING(30) | `'esewa'`, `'khalti'`, `'card'`, `'debit_card'`, `'connectips'` |
| `paymentStatus` | STRING(20) | `'pending'`, `'completed'`, `'failed'`, `'refunded'` |
| `transactionId` | STRING(100) | Payment gateway ID |
| `bookingStatus` | STRING(20) | `'confirmed'`, `'cancelled'`, `'completed'` |
| `riderRating` | INTEGER | 1-5 stars rating |
| `riderReview` | STRING(500) | Passenger review |
| `ratedAt` | DATE | Rating submission time |

**Responsibilities:** Connect passengers to rides, process payments, handle ratings/reviews

---

### 5. **VERIFICATION**
**Table:** `verifications`

| Field | Type | Responsibility |
|-------|------|----------------|
| `id` | INTEGER (PK) | Unique identifier |
| `userId` | INTEGER (FK) | User being verified |
| `citizenshipFront` | STRING(255) | Citizenship photo front |
| `citizenshipBack` | STRING(255) | Citizenship photo back |
| `citizenshipNumber` | STRING(50) | Citizenship number |
| `drivingLicenseFront` | STRING(255) | License photo front |
| `drivingLicenseBack` | STRING(255) | License photo back |
| `drivingLicenseNumber` | STRING(50) | License number |
| `licenseExpiryDate` | DATEONLY | License expiry |
| `verificationType` | ENUM | `'user_only'`, `'rider'`, `'both'` |
| `status` | ENUM | `'pending'`, `'approved_user'`, `'approved_rider'`, `'approved_both'`, `'rejected'` |
| `adminRemarks` | TEXT | Rejection reason |
| `submittedAt` | DATE | Submission time |
| `reviewedAt` | DATE | Review time |
| `reviewedBy` | INTEGER (FK) | Admin who reviewed |

**Responsibilities:** Identity verification for users and riders, admin approval workflow

---

### 6. **NOTIFICATION**
**Table:** `notifications`

| Field | Type | Responsibility |
|-------|------|----------------|
| `id` | INTEGER (PK) | Unique identifier |
| `userId` | INTEGER (FK) | Target user |
| `type` | STRING(50) | `'verification_approved'`, `'ride_request'`, etc. |
| `title` | STRING(100) | Notification title |
| `message` | TEXT | Full message |
| `relatedId` | INTEGER | Related entity ID |
| `isRead` | BOOLEAN | Read status |
| `readAt` | DATE | Read timestamp |

**Responsibilities:** Alert users about verifications, ride status, payments

---

## 🔗 RELATIONSHIP SUMMARY

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Vehicle | **1:1** | One vehicle per user (rider) |
| User → Ride | **1:M** | One user can offer many rides |
| Ride → RideBooking | **1:M** | One ride can have many bookings |
| User → RideBooking | **1:M** | One user can make many bookings |
| User → Verification | **1:M** | User can submit multiple verification requests |
| User → Notification | **1:M** | User can receive many notifications |

---

## 📊 ER DIAGRAM

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USER        │       │    VEHICLE      │       │     RIDE        │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──┐   │ id (PK)         │       │ id (PK)         │
│ username        │   │   │ vehicleNumber   │       │ from            │
│ phone           │   │   │ vehicleType     │       │ to              │
│ email           │   │   │ vehiclePhoto   │       │ date            │
│ password        │   │   │ vehicleBrand   │       │ time            │
│ role            │   │   │ vehicleModel   │       │ pickupLocation  │
│ profilePicture  │   │   │ userId (FK) ───┼───────┤ vehicleNumber   │
│ isVerifiedUser  │   │   └────────────────┘       │ vehiclePhoto    │
│ isVerifiedRider │   │         │                  │ vehicleType     │
│ mpin            │   │         │ 1:1              │ description     │
│ paymentMethod   │   │         │                  │ price           │
│ cardLastFour    │   │         │                  │ availableSeats  │
│ cardHolderName  │   │         │                  │ status          │
│ cardExpiry      │   │         │                  │ bookedSeats     │
│ cardBrand       │   │         │                  │ userId (FK) ───►│
└────────┬────────┘   │         │                  └────────┬────────┘
         │            │         │                           │
         │            │         │                           │
         │            │         │                           │
         │      ┌─────┴─────────┴───────────────────────────┘
         │      │         1:M (One User → Many Rides)
         │      │      
         │      │
         │      │ M:1 (Many Rides → 1 User as Rider)
         │      │
         │      ▼
         │    ┌───────────────────┐       ┌─────────────────┐
         │    │   RIDEBOKING     │       │  VERIFICATION  │
         │    ├───────────────────┤       ├─────────────────┤
         │    │ id (PK)          │       │ id (PK)         │
         ├───►│ rideId (FK) ─────┼──────►│ userId (FK) ───►│
         │    │ passengerId(FK) │       │ citizenshipFront│
         │    │ seatsBooked     │       │ citizenshipBack  │
         │    │ totalAmount     │       │ citizenshipNumber│
         │    │ paymentMethod   │       │ drivingLicenseFr │
         │    │ paymentStatus   │       │ drivingLicenseBk │
         │    │ transactionId   │       │ drivingLicenseNo │
         │    │ bookingStatus   │       │ verificationType │
         │    │ riderRating     │       │ status           │
         │    │ riderReview     │       │ adminRemarks     │
         │    │ ratedAt         │       │ submittedAt      │
         │    └───────────────────┘       │ reviewedAt       │
         │                                │ reviewedBy       │
         │      M:1 (Many Bookings → 1 Ride) └─────────────────┘
         │      M:1 (Many Bookings → 1 Passenger)
         │
         │
         ▼
┌─────────────────────┐
│    NOTIFICATION     │
├─────────────────────┤
│ id (PK)             │
│ userId (FK) ────────┼───────► 1:M (One User → Many Notifications)
│ type                │
│ title               │
│ message             │
│ relatedId           │
│ isRead              │
│ readAt              │
└─────────────────────┘
