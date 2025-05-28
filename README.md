# Fetch Dog Adoption

A web application to help find shelter dogs their forever homes. Built with React and Tailwind CSS.

## Features

- Browse and search through available shelter dogs
- Filter dogs by breed, age, and location
- Sort results by various criteria
- Favorite dogs you're interested in
- Get matched with your perfect dog
- Responsive design for all devices

## Demo
![Demo](assets/fetchDatabaseDemo.gif)

## Local Development Setup

To run this project locally:

1. Clone the repository
2. Open in your preferred IDE (VS Code, WebStorm, etc.)
3. Use the Live Server extension (or equivalent) to start a local server
4. The site will automatically open in your default browser

## Project Structure

- `src/` - Source code
  - `App.js` - Main application component
  - `Login.js` - Login screen component
  - `DogCard.js` - Dog card component
  - `ErrorBoundary.js` - Error handling component
- `assets/` - Static assets (images)

## Technologies Used

- React 18
- Tailwind CSS
- Axios for API calls
- Babel for JSX transformation

## API Integration

The application integrates with the Fetch API (https://frontend-take-home-service.fetch.com) for:
- User authentication
- Dog data retrieval
- Breed filtering
- Matching algorithm

## Development Decisions & Scalability

This project uses a simple development setup optimized for quick deployment and easy review. For a production environment, it could be enhanced with:

- **Build System**: Implement Vite or webpack for optimized builds and better development experience
- **Type Safety**: Add TypeScript for improved code reliability and developer experience
- **Testing**: Implement Jest and React Testing Library for unit and integration tests
- **State Management**: Add Redux or React Query for more complex state management
- **CI/CD**: Setup GitHub Actions for automated testing and deployment
- **Performance**: Implement code splitting and lazy loading for larger scale
- **Realtime Search**: Implement client-side filtering for instant feedback

The current project is designed to be easily scalable with these enhancements while maintaining clean code organization and best practices.

## Notes

- The application uses in-browser Babel transformation for development simplicity
- Styles are handled through Tailwind CSS for rapid UI development
- Error boundaries are implemented for graceful error handling
- Responsive design ensures compatibility across devices

## Credit:

Icon
- https://iconduck.com/sets/eva-icons

Dog Photo
- https://www.pexels.com/photo/shallow-focus-photography-of-adult-black-and-white-border-collie-551628/

Database
- Fetch Programming Test