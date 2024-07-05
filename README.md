# HodlInfo Clone

A project that fetches cryptocurrency data from an API, stores it in a PostgreSQL database, and displays it on a web page.

## Objective

🎯 The objective of this project is to create a real-time dashboard that displays top 10 cryptocurrency data, including last traded price, buy/sell prices, volume, and percentage differences.

## Technology Stack

- **Node.js**: Backend server environment
- **Express.js**: Web framework for Node.js
- **Axios**: HTTP client for fetching data from APIs
- **PostgreSQL**: Database for storing cryptocurrency data
- **HTML/CSS/JavaScript**: Frontend web development

## Implementation Overview

### Backend (`server.js`)

The backend of this project, managed through `server.js`, handles the server-side operations and database management:

#### Setting Up Express Server

The project utilizes Express.js to create a server that serves static files and provides API endpoints. Here’s a breakdown of its key functionalities:

- **Static File Serving**: The server serves static files like HTML, CSS, and client-side JavaScript from the `public` directory using `express.static`.

- **Environment Configuration**: It uses `dotenv` to manage environment variables for sensitive information like database credentials.

#### PostgreSQL Database Integration

The project integrates with PostgreSQL to persist cryptocurrency data fetched from the WazirX API. Key database operations include:

- **Database Connection**: Connects to the PostgreSQL database using the `pg` library, configuring it with credentials from environment variables.

- **Schema Management**: Defines and updates the database schema as necessary, ensuring compatibility with the fetched data structure. For example, it adds columns like `difference` and `savings` to the `crypto_data` table if they do not exist.

#### Data Fetching and Storage

To populate the database with real-time cryptocurrency data, the backend performs the following steps:

- **API Data Fetching**: Uses Axios to fetch data from the WazirX API (`https://api.wazirx.com/api/v2/tickers`). It retrieves data for all available cryptocurrencies and their trading details.

- **Data Processing**: Processes the fetched data to extract and compute necessary metrics such as percentage difference (`difference`) and savings (`savings`) based on buy and sell prices.

- **Database Interaction**: Ensures data integrity by clearing existing data (`DELETE FROM crypto_data`) and inserting the latest top 10 cryptocurrency data into the `crypto_data` table.

#### API Endpoint

The backend exposes an API endpoint `/data` to serve the fetched cryptocurrency data:

- **Data Retrieval**: Responds to HTTP GET requests with JSON data containing the latest information from the `crypto_data` table.

### Frontend (`index.html`, `script.js`, `styles.css`)

The frontend components handle the presentation and dynamic updating of cryptocurrency data on the user interface:

#### HTML Structure (`index.html`)

The main HTML file defines the structure of the web page, incorporating elements for displaying cryptocurrency data in a tabular format. It includes:

- **Container Structure**: A structured layout using `<div>` elements to organize header, navigation, and table sections.

- **Dynamic Content Insertion**: Utilizes JavaScript to dynamically populate the `<tbody>` of the cryptocurrency table (`<table class="crypto-table">`) with fetched data.

#### JavaScript Logic (`script.js`)

Client-side JavaScript manages data fetching from the server and updating the UI in real-time:

- **Data Fetching**: Utilizes `fetch()` to retrieve cryptocurrency data from the server's `/data` endpoint asynchronously.

- **UI Updating**: Dynamically updates the HTML content based on fetched data, including real-time calculations for percentage differences and savings.

- **Interval Updates**: Sets intervals to periodically fetch and update data every 5 minutes, 1 hour, and 1 day, optimizing the user experience with current cryptocurrency information.

#### Styling (`styles.css`)

The CSS file provides styling rules to enhance the visual appeal and usability of the web page:

- **Color Scheme**: Uses a dark theme (`background-color: #191d28;`) to emphasize data visibility and reduce eye strain.

- **Responsive Design**: Implements media queries (`@media screen and (max-width: 768px)`) to ensure optimal display on various devices, including mobile phones and tablets.

## Scope of Improvement

### Future Enhancements

- **Real-time Updates**: Implement WebSocket technology for instant data updates without periodic polling, enhancing user experience with live cryptocurrency information.

- **User Authentication**: Introduce user authentication mechanisms to secure sensitive API endpoints and database operations.

- **Mobile Optimization**: Further optimize the frontend design for smaller screens, ensuring a seamless experience across all devices.

- **Error Handling**: Enhance error handling mechanisms to gracefully manage and display errors to users, improving system reliability.

### Conclusion

This project aims to provide a robust, scalable solution for displaying real-time cryptocurrency data through an intuitive web interface. By leveraging Node.js, Express.js, PostgreSQL, and client-side technologies, it ensures efficient data management and a responsive user experience.

---

Feel free to adjust and expand upon each section to better fit your project's specific requirements and technical details.
