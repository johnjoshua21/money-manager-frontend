# Money Manager Frontend

A modern, feature-rich web application for managing personal and business finances built with React, Tailwind CSS, and Vite.

## Features

### Dashboard
- **Period-based Summary**: View income/expense summaries for weekly, monthly, or yearly periods
- **Visual Charts**: Interactive bar charts showing income vs expense trends
- **Category Breakdown**: Pie chart visualization of expenses by category
- **Division Summary**: Separate tracking for Office and Personal finances
- **Real-time Balance**: See your current financial status at a glance

### Transaction Management
- **Add Transactions**: Easy-to-use modal for adding income and expenses
- **Edit & Delete**: Modify transactions within 12 hours of creation
- **Smart Filtering**: Filter by date range, type, division, and category
- **Category Icons**: Visual representation with emojis for each category
- **Detailed History**: View complete transaction history with timestamps

### Account Management
- **Multiple Accounts**: Create and manage multiple financial accounts
- **Balance Tracking**: Real-time balance updates
- **Total Overview**: See combined balance across all accounts

### Transfers
- **Inter-account Transfers**: Transfer money between accounts
- **Transfer History**: Track all transfers with date and description
- **Balance Validation**: Prevents transfers exceeding available balance

### Additional Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Ready**: Clean, modern UI with Tailwind CSS
- **Real-time Updates**: Automatic refresh after operations
- **Error Handling**: User-friendly error messages
- **12-Hour Edit Window**: Business rule enforcement for data integrity

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Recharts**: Beautiful, responsive charts
- **Axios**: HTTP client for API calls
- **date-fns**: Modern date utility library
- **Lucide React**: Beautiful icon library



## Project Structure

```
money-manager-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   └── TransactionModal.jsx
│   ├── contexts/          # React Context providers
│   │   └── AppContext.jsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Accounts.jsx
│   │   └── Transfers.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── utils/             # Utility functions
│   │   └── helpers.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## API Integration

The app integrates with the Money Manager Backend API. Make sure the backend is running and accessible.


### Adding New Categories
Categories are managed from the backend. Initialize default categories using the API endpoint:

```
POST /api/categories/initialize
```
