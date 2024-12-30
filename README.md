


# Dynamic Event Calendar Application

This is a Dynamic Event Calendar Application built with **React.js** to help users manage their events. The app allows users to view events by date, add new events, edit existing ones, and delete events. It includes a color-coding system for different event categories (e.g., Work, Personal, Others). Users can export their events to a CSV file for easy access.

## Features

- **Interactive Calendar**: View events for the current month with clickable days and easy navigation between months.
- **Event Creation and Management**: Add, edit, and delete events.
  - Each event includes:
    - Event name
    - Start and end times
    - Optional description
    - Category (Work, Personal, or Others)
  - All events are listed in a separate modal for each date.
  - Events are color-coded based on the category.
- **Highlight Current Day**: The current day is visually highlighted in the calendar.
- **Event Export**: Export all events to a CSV file for easy download and sharing.
- **Local Storage**: Events are saved in the browser’s local storage, ensuring persistence across sessions.

## Technologies Used

- **React.js** for the frontend
- **Date-fns** for date handling
- **Tailwind CSS** for styling (for quick and responsive UI development)
- **LocalStorage** for persistent event data storage
- **CSV Export** functionality for event download

## Running the App Locally

Follow these steps to get the app up and running on your local machine:

### Prerequisites

Ensure that you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (Version 14 or later)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/event-calendar-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd event-calendar-app
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The app will be accessible at [http://localhost:3000](http://localhost:3000) in your browser.

### Development

- To make changes to the app, simply edit the files in the `src` folder.
- Once you save your changes, the development server will automatically reload the app.

## Deployed App

You can access the live version of the app by visiting:

**[Deployed Event Calendar Application](https://eventcalendar16.netlify.app/)**

## Folder Structure

Here is a brief overview of the project folder structure:

```
event-calendar-app/
├── public/
│   └── index.html       # HTML template
├── src/
│   ├── components/      # Reusable components like the calendar, event form, and dialog
│   ├── App.tsx          # Main application component
│   ├── index.tsx        # Entry point for the React app
│   ├── styles/          # Tailwind CSS configuration (if applicable)
│   └── utils/           # Helper functions for date handling, event management, etc.
└── package.json         # Project dependencies and scripts
```

## Contact

For any inquiries, please contact [your-email@example.com](mailto:agarwalanusha@13@example.com).



