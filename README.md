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

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running backend API (Spring Boot)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd money-manager-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Deploy
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard
   - `VITE_API_URL`: Your deployed backend API URL

### Deploy to Netlify

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Set environment variables in Netlify dashboard
   - `VITE_API_URL`: Your deployed backend API URL

### Deploy to GitHub Pages

1. Install gh-pages
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. Deploy
   ```bash
   npm run deploy
   ```

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

### API Endpoints Used

- **Transactions**: CRUD operations for income/expense
- **Dashboard**: Summary statistics and chart data
- **Accounts**: Account management
- **Transfers**: Inter-account transfers
- **Categories**: Category management

## Features in Detail

### Dashboard
- Select period (Weekly/Monthly/Yearly)
- Choose specific month/year
- View income, expense, and balance cards
- Interactive charts with hover tooltips
- Category-wise expense breakdown
- Division-wise financial summary

### Transactions
- Two-tab modal (Income/Expense)
- Category selection with icons
- Division selection (Office/Personal)
- Date and time picker
- Description field
- Edit within 12 hours
- Delete within 12 hours
- Advanced filtering options

### Accounts
- Create multiple accounts
- Edit account details
- Delete accounts
- View total balance across accounts

### Transfers
- Select source and destination accounts
- Enter amount and description
- Date and time selection
- Automatic balance validation
- Transfer history with filters

## Customization

### Changing Colors
Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Adding New Categories
Categories are managed from the backend. Initialize default categories using the API endpoint:

```
POST /api/categories/initialize
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues
- Verify backend is running
- Check VITE_API_URL in .env
- Ensure CORS is configured in backend

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## Contributing

This is a hackathon project. Feel free to fork and customize for your needs.

## License

Open source - MIT License

## Support

For issues and questions, please open an issue in the GitHub repository.
