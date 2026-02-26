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

### 7. **ISSUE**
**Table:** `issues`

| Field | Type | Responsibility |
|-------|------|----------------|
| `id` | INTEGER (PK) | Unique identifier |
| `userId` | INTEGER (FK) | User who raised the issue |
| `issueType` | STRING(50) | `'booking'`, `'verification'`, `'payment'`, `'ride_experience'`, `'technical'`, `'account'`, `'other'` |
| `subject` | STRING(100) | Brief subject/title (10-100 chars) |
| `description` | TEXT | Detailed description |
| `photo` | STRING(255) | Optional screenshot |
| `status` | STRING(20) | `'open'`, `'in_progress'`, `'resolved'`, `'closed'` |
| `assignedTo` | INTEGER (FK) | Admin assigned to handle issue |
| `adminResponse` | TEXT | Admin response |
| `respondedAt` | DATE | When admin responded |
| `resolvedAt` | DATE | When issue was resolved |

**Responsibilities:** Track user support issues, admin assignment and resolution workflow

---

### 8. **REPORT**
**Table:** `reports`

| Field | Type | Responsibility |
|-------|------|----------------|
| `id` | INTEGER (PK) | Unique identifier |
| `bookingId` | INTEGER (FK) | Referenced booking |
| `rideId` | INTEGER (FK) | Referenced ride |
| `reporterId` | INTEGER (FK) | User who is reporting |
| `reportedRiderId` | INTEGER (FK) | Rider being reported |
| `issueType` | STRING(50) | `'safety'`, `'behavior'`, `'vehicle_condition'`, `'route_deviation'`, `'overcharging'`, `'late_arrival'`, `'other'` |
| `remarks` | TEXT | Detailed remarks from user |
| `status` | STRING(20) | `'pending'`, `'under_review'`, `'resolved'`, `'dismissed'` |
| `reviewedBy` | INTEGER (FK) | Admin who reviewed |
| `adminRemarks` | TEXT | Admin notes/action taken |
| `reviewedAt` | DATE | When report was reviewed |

**Responsibilities:** Handle passenger complaints about riders, admin review workflow

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
| User → Issue | **1:M** | User can raise many issues |
| User → Issue (assignedTo) | **1:M** | Admin can handle many issues |
| RideBooking → Report | **1:M** | One booking can have many reports |
| Ride → Report | **1:M** | One ride can have many reports |
| User → Report (reporter) | **1:M** | User can make many reports |
| User → Report (reportedRider) | **1:M** | Rider can receive many reports |

---

## 📊 COMPLETE ER DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LIFT NEPAL - ER DIAGRAM                             │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │     USER     │
                                    ├──────────────┤
                                    │ id (PK)      │
                                    │ username     │
                                    │ phone        │
                                    │ email        │
                                    │ password     │
                                    │ role         │
                                    │ profilePictur│
                                    │ isVerifiedUsr│
                                    │ isVerifiedRidr│
                                    │ mpin         │
                                    │ hasMpinSetup │
                                    │ paymentMethod│
                                    │ cardLastFour │
                                    │ cardHolderNam│
                                    │ cardExpiry   │
                                    │ cardBrand    │
                                    └──────┬───────┘
                                           │
           ┌───────────┬───────────────────┼───────────────────┬───────────┐
           │           │                   │                   │           │
           ▼           ▼                   ▼                   ▼           ▼
    ┌────────────┐ ┌──────────┐    ┌─────────────┐    ┌──────────────┐ ┌───────────┐
    │  VEHICLE   │ │   RIDE   │    │ VERIFICATION│    │  NOTIFICATION│ │  ISSUE   │
    ├────────────┤ ├──────────┤    ├─────────────┤    ├──────────────┤ ├───────────┤
    │ id (PK)    │ │ id (PK)  │    │ id (PK)     │    │ id (PK)      │ │ id (PK)   │
    │vehicleNumbr│ │ from     │    │ userId (FK)│    │ userId (FK)  │ │ userId(FK)│
    │vehicleType│ │ to       │    │citizenshipFr│   │ type         │ │ issueType │
    │vehiclePhoto││ date     │    │citizenshipBk│   │ title        │ │ subject   │
    │vehicleBrand││ time     │    │citizenshipNo│   │ message      │ │ description│
    │vehicleModel││pickupLoc │    │drivingLicFr │   │ relatedId    │ │ photo     │
    │userId(FK)  ││vehicleNum│    │drivingLicBk │   │ isRead       │ │ status    │
    └────────────┘ │vehicleTp │    │drivingLicNo │   │ readAt       │ │ assignedTo│
         │         │description│   │licenseExpiry│   └──────────────┘ │adminResponse│
         │1:1      │ price     │    │verifyType   │         │         │ respondedAt│
         │         │availSeats │    │ status      │         │1:M      │ resolvedAt │
         │         │ status    │    │adminRemarks │         │         └───────────┘
         │         │bookedSeats│    │ submittedAt │         │
         │         │userId(FK) │    │ reviewedAt  │         │           M:1
         │         └─────┬─────┘    │ reviewedBy  │         │ (Many Issues → 1 User)
         │               │          └─────────────┘         │ (Many Issues → 1 Admin)
         │               │                  │                │
         │               │ M:1             │                │
         │               ▼                  │                │
         │        ┌──────────────┐          │                │
         │        │ RIDEBOKING  │          │                │
         │        ├─────────────┤          │                │
         │        │ id (PK)     │◄─────────┘                │
         │        │ rideId(FK)──┼────────────────────────────┘
         │        │ passengerId │
         │        │ seatsBooked │
         │        │totalAmount  │
         │        │paymentMethod│
         │        │paymentStatus│
         │        │transactionId│
         │        │bookingStatus│
         │        │ riderRating │
         │        │ riderReview │
         │        │ ratedAt     │
         │        └──────┬──────┘
         │               │
         │         M:1   │  M:1
         │    (Many      │  (Many
         │  Bookings  →  │  Bookings →
         │   1 Ride)     │  1 Passenger)
         │               │
         │               ▼
         │        ┌──────────────┐
         │        │    REPORT    │
         │        ├──────────────┤
         │        │ id (PK)      │
         │        │ bookingId(FK)│
         │        │ rideId(FK)   │
         │        │ reporterId(FK)│
         │        │reportedRider │
         │        │ issueType    │
         │        │ remarks      │
         │        │ status       │
         │        │ reviewedBy   │
         │        │ adminRemarks  │
         │        │ reviewedAt   │
         │        └──────────────┘
         │
         │ M:1 (One User → Many Notifications)
         │
         ▼
```

---

## 📋 DATABASE SCHEMA SUMMARY

| Entity | Table Name | Key Relationships |
|--------|------------|-------------------|
| USER | users | Central entity - links to all other entities |
| VEHICLE | vehicles | 1:1 with User |
| RIDE | rides | 1:M with User, 1:M with RideBooking |
| RIDEBOOKING | ride_bookings | M:1 with Ride, M:1 with User, 1:M with Report |
| VERIFICATION | verifications | M:1 with User |
| NOTIFICATION | notifications | M:1 with User |
| ISSUE | issues | M:1 with User (creator & assignee) |
| REPORT | reports | M:1 with RideBooking, Ride, User (reporter & reported) |

**Total Entities: 8**
**Total Tables: 8**
