# Flight Booking System

## Description
The Flight Booking System is a platform designed to streamline the process of searching, booking, and managing flight reservations. 
This system empowers users to effortlessly explore available flight options, make bookings, and efficiently manage their reservations. 
Additionally, the system is engineered to handle the complexities and challenges that arise in a concurrent environment, ensuring seamless performance even under heavy load.

## Architecture Overview
![Airline](https://github.com/user-attachments/assets/32b15284-c827-4de0-8a64-b696e748f9a1)


## Schema and Relations Between Models
![Schema](https://github.com/K3shavGarg/Flight_Booking_System/blob/master/Schema%20(1).png?raw=true)



## Features
- CRUD Operations: Manage airports, airplanes, and flights with full CRUD functionality.
- Flight Search: Search flights using filters like destination, date, and price range.
- Concurrency Handling: Prevent race conditions with database transactions to ensure consistency.
- Cron Jobs: Automatically remove ghost bookings with scheduled cron jobs at fixed intervals.

## Technologies Used
- **Backend**: Node.js, Go,
- **Database**: MySQL
- **Other Tools**: Docker, RabbitMQ, POSTMAN (for API TESTING)
