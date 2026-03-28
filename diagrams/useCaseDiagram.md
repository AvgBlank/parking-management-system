# Use Case Diagram

This diagram maps out the primary actions that each user role (`driver` and `admin`) can perform within the Parking Management System. 

It also includes correct UML `<<include>>` and `<<extend>>` relationships to show dependencies between functions, and standardizes the actor links without directional arrows.

```mermaid
flowchart LR
    %% Actors
    Driver([👤 Driver])
    Admin([🛠️ Admin])

    %% System Boundary
    subgraph "Parking Management System Core Functions"
        
        %% Driver Use Cases
        UC1(Register User Profile)
        UC2(Add/Manage Vehicles)
        UC3(Search Available Parking Slots)
        UC4(Create a Booking)
        UC5(Process Payment)
        UC6(View Booking/Payment History)

        %% Admin Use Cases
        UC8(Manage Floors & Slots)
        UC9(Manage User Accounts)

        %% Admin Operational Use Cases
        UC11(Verify Arriving Vehicles/Bookings)
        UC13(Check-in / Check-out Vehicles)

        %% Includes and Extends 
        %% (Dotted arrows pointing from Base to Included, or Extending to Base)
        UC4 -. "«include»" .-> UC5
        UC3 -. "«extend»" .-> UC4
        UC13 -. "«extend»" .-> UC11
    end

    %% Actor to Use Case Relationships (Standard Undirected Lines)
    
    %% Driver Links (Left side automatically because they are listed first)
    Driver --- UC1
    Driver --- UC2
    Driver --- UC3
    Driver --- UC4
    Driver --- UC6

    %% Admin Links (Flipped syntax to force Admin to render on the RIGHT side)
    UC8 --- Admin
    UC9 --- Admin
    UC3 --- Admin
    UC11 --- Admin
    UC13 --- Admin
    
    %% Shared UI styles for actors
    classDef actorStyle fill:#2b2b2b,stroke:#a6a6a6,stroke-width:2px,color:#fff,font-weight:bold;
    class Driver,Admin actorStyle;
```
