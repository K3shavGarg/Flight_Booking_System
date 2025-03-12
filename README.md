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

## Setup The Project 
- Clone the project in your local machine
- Go inside the folder path and execute the following command:
    ```
    npm install
    ```
- In the root directory create a .env file and add the following env variables
    ```
    PORT=<port number of your choice>
    ```
    ex:
        ```
         PORT=3000
        ```
- In src/config/config.json file set up your development environment, then write the username of your db, password of your db and in dialect mention whatever db you are using for ex: mysql, mariadb etc.
- After configuring your database you will need to run the Sequelize migrations to create or update the database tables. You can do this using the Sequelize CLI:
    ```
      npx sequelize-cli db:migrate
    ```
- Run the server using command:
    ```
      npm run dev
    ```

## Schema and Relations Between Models
![Schema](https://raw.githubusercontent.com/K3shavGarg/Flight_Booking_System/master/Schema.png)
