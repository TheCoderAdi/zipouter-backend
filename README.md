# ZipOuter Backend

Welcome to the backend repository of ZipOuter – a revolutionary platform for automating the compilation of student-program submissions. ZipOuter simplifies the process of running multiple programs simultaneously, providing an efficient solution for educators and students.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Multi-Language Support:** ZipOuter supports various programming languages, including Java, Python, and JavaScript, ensuring versatility in classroom coding environments.

- **Efficient Compilation:** The backend automates the compilation process, saving valuable time for educators by handling the simultaneous execution of multiple student programs.

- **Error Tracking & Feedback:** Instantly identify compilation errors and provide constructive feedback to students, fostering a collaborative and supportive learning environment.

- **User-Friendly API:** The backend provides a user-friendly API, making it easy for frontend applications, such as the ZipOuter web interface, to interact with and utilize the compilation services.

## Setup

To set up the ZipOuter backend on your local machine, follow these steps:

0. Before proceeding, ensure that you have Java, Node.js, and Python installed on your local machine. You can download and install them from the official websites:

- [Java](https://www.oracle.com/java/technologies/javase-downloads.html)
- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

Once installed, you can follow the steps below to set up the ZipOuter backend:

1. Clone this repository:
   ```bash
     https://github.com/TheCoderAdi/zipouter-backend.git
   ```

2. Install dependencies:
   ```bash
   cd zipouter-backend
   npm install
   ```
   
3. Start the server:
   ```bash
   npm start
   ```

## Usage

The backend is designed to work seamlessly with the ZipOuter frontend. Ensure the frontend application is configured to communicate with this backend by updating the API endpoint settings.

## API Endpoints

- **`POST /upload`**: Handles the compilation of a single program submission.
- **`POST /upload-multiple`**: Handles the compilation of multiple program submissions.

## Contributing

We welcome contributions to improve and enhance the ZipOuter backend. Follow these guidelines when contributing:
- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and submit a pull request.

## License

This project is licensed under the MIT License 
