# SDLC Plan — Parking Lot Management System

## Phase 1 — Planning

**Goal:** Define scope, actors, and core features.

**Actors:**

- Driver — books and pays for parking
- Admin — manages lots, floors, slots, views reports, and checks vehicles in and out at the gate

**Core Features (MVP):**

- User registration and login (JWT auth)
- Browse parking lots and available slots
- Book a slot with start/end time
- Pay via Stripe
- Auto-release slot if payment not made in 15 minutes
- Admin dashboard for lot and slot management

## Phase 2 — System Design

**Architecture:** 3-tier (Client → API → Database)

**Design Patterns selected (in routes, middleware, and services):**

1. **Repository Pattern** — Services interact with the database through repository classes, abstracting data access and making it easier to swap or mock data sources.
2. **Factory Pattern (where applicable)** — Used for creating service or middleware instances based on configuration or context.

**OOP Principles applied:**
| Principle | Where |
|---|---|
| Abstraction | BaseEntity, IBookable, IPayable, IRepository interfaces |
| Encapsulation | User password is private; slot status changed only via reserve()/release() |
| Inheritance | Driver and Admin extend User |
| Polymorphism | All observers called via handle(); slots implement IBookable |

**SOLID Principles:**
| Principle | Application |
|---|---|
| Single Responsibility | Each service class has one job (BookingService only handles bookings) |
| Open/Closed | New notification channels = new Observer class, no existing code changed |
| Liskov Substitution | Admin can replace User anywhere User is expected |
| Interface Segregation | IBookable and IPayable are separate — not every entity needs both |
| Dependency Inversion | Services depend on IRepository, not concrete Beanie Document classes |

---
