# Expense Logging App

This project is a comprehensive web application that manages employee expenses and visualizes financial data through interactive charts. It allows users to perform CRUD operations on expense data stored in Firebase and provides real-time updates on financial statistics.

## Features

- **CRUD Operations**: Create, read, update, and delete expenses for each employee.
- **Data Visualization**: Financial data visualization through interactive charts representing various expense categories and statuses.
- **Real-Time Updates**: Changes in the data are immediately reflected across all components of the application.
- **Responsive Design**: The application is fully responsive, ensuring a seamless experience on desktops, tablets, and mobile devices.
- **Session Management**: Implements session management to securely handle user authentication and maintain user sessions across visits. Users must log in to access the application, and sessions are managed to ensure security and integrity of the user data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before running this project, make sure you have Node.js and Yarn installed on your system. You can download and install them from the following links:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Installation and Setup

First, clone the repository to your local machine:

```bash
git clone https://github.com/AhsanRao/expense-app.git
cd expense-app-react
```

### Installing Dependencies

To set up the project environment, install the required dependencies:

```bash
yarn install
```

### Running the Development Server

To start the development server, execute the following command:

```bash
yarn dev
```

This command launches the server and enables hot reloading. You can view the application by navigating to http://localhost:3030 in your web browser.

### Building for Production

To build the application for production, run the following command:

```bash
yarn build
```

This process compiles the application into static files in the build directory, ready for deployment.

## User Login Details

To access the application, use the following credentials:

- **Email**: `ash@g.cc`
- **Password**: `open`

### Customizing Login Credentials

You can change these credentials by editing the `account.js` file located in the `src/_mock/` directory of the project.

```text
// src/_mock/account.js

export const account = {
  email: 'ash@g.cc',
  password: 'open'
};
```