# Flight Booking System

## Description
The Flight Booking System is a platform designed to streamline the process of searching, booking, and managing flight reservations. 
This system empowers users to effortlessly explore available flight options, make bookings, and efficiently manage their reservations. 
Additionally, the system is engineered to handle the complexities and challenges that arise in a concurrent environment, ensuring seamless performance even under heavy load.


## Features
- CRUD Operations: Manage airports, airplanes, and flights with full CRUD functionality.
- Flight Search: Search flights using filters like destination, date, and price range.
- Concurrency Handling: Prevent race conditions with database transactions to ensure consistency.
- Cron Jobs: Automatically remove ghost bookings with scheduled cron jobs at fixed intervals.

## Technologies Used
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Other Tools**: Cron jobs, Sequelize (for ORM) , POSTMAN (for API TESTING)

## Schema and Relations Between Models
    ![image](https://github.com/user-attachments/assets/95cf53fa-c621-4778-9834-97afef35b552)
    

