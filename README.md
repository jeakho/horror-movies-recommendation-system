# horror-movies-recommendation-system

## Overview
The "horror-movie-recommendation-system" project is a web application that serves as a horror movie recommendation system to users based on the analysis of their movie descriptions and reviews using machine learning. The application addresses two main tasks:
1. Recommending the N most similar movies in terms of plot to a given one.
2. Recommending movies based on their ratings.

## Status
Development completed

## Features
1. Selecting the desired movie.
2. Displaying movies with a plot most similar to the chosen one.
3. Setting display parameters (used machine learning model, number of movies to display).
4. Viewing full information about the selected movie.
5. Showing movies sorted by their predicted rating.
6. Changing the sorting order of movies by rating (ascending/descending).

## Getting started
### Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- **Node.js**: I recommend using Node.js version 18.17.1 for running the application.
- **Angular CLI**: I recommend using Angular CLi version 16.2.2 for running the application.
- **Python**: I recommend using Python version 3.11.5 for running the server.


### Server side
1. Clone this repository to your local machine: `https://github.com/jeakho/horror-movies-recommendation-system.git`.
2. Navigate to the server directory: `cd serve`.
3. Unzip the archive `db.zip` into the folder `db`.
4. Start the server: `python rest_service.py`.
5. The server should now be running and accessible at the specified API endpoint (e.g., `http://localhost:5000`).

### Client side
1. Navigate to the client directory: `cd client`.
2. Install the required dependencies using npm or yarn: `npm install` **or** `yarn install`.
3. Start the Angular development server: `ng serve`
4. Open your web browser and navigate to `http://localhost:4200` to access the client-side application.

## Technologies used

The Horror Movies Recommendation System is built using the following technologies and libraries:
- Angular
- Angular CLI
- TypeScript
- HTML5/CSS3
- RESTful APIs
- Angular Material
- RxJS
- Git/GitHub
- Flask

For a complete list of dependencies, please refer to the `package.json` file.
