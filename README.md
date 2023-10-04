<!-- GETTING STARTED -->
A library management system with the following features
* Add authors
* Add books
* Search library based on book author
* Search library based on book name
* Search library based on both author and book name

## Getting Started

### Prerequisites

Tech stack required to run the app.
* NodeJS - runtime 
* MongoDB - database

It is assumed that you have these components setup already.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/vixen24/My-Library.git
   ```
2. Install npm packages
   ```sh
   npm install
   ```
3. Create a .env file in the root folder and assign database connection string
   ```sh
   DATABASE_URL=mongodb://localhost:27017
   ```
4. Run the app
   ```sh
   npm start
   ```

## Project Description
The app allows users to manage an online book library and has the following features
1.  Add/Edit an author
3.  Add/Edit a book 
5.  View library catalog

The structure of the app is monolithic. 

The below packages were used.

* EJS template - to generate templates
* EJS view engine - to render web pages using EJS template files 
