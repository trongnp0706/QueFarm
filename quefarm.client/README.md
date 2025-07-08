# QueFarm Client

A modern React e-commerce application built with Ant Design and Tailwind CSS.

## Features

### Product Detail Page

The Product Detail Page (`/src/features/product/ProductDetail.jsx`) is a comprehensive component that showcases product information with the following features:

#### 🍞 Breadcrumb Navigation
- Uses Ant Design's `Breadcrumb` component
- Dynamic navigation: Home > Category > Product
- Clickable breadcrumb items with React Router navigation
- Responsive design with proper spacing

#### 📱 Responsive Layout
- Mobile-first design using Tailwind CSS
- Ant Design's `Row` and `Col` components for grid layout
- Optimized for desktop, tablet, and mobile views
- Flexible image gallery with preview functionality

#### 🛍️ Product Information Display
- **Product Images**: High-quality image display with preview modal
- **Product Details**: Name, price, rating, and description
- **Interactive Elements**: Wishlist toggle, quantity selector
- **Action Buttons**: Add to cart and buy now functionality
- **Product Features**: Shipping, warranty, and return information

#### 🎨 Ant Design Integration
- `Card` components for organized content sections
- `Rate` component for star ratings
- `Descriptions` for detailed product specifications
- `Badge` for status indicators
- `Alert` for error and warning messages
- `Spin` for loading states
- `Image` component with preview functionality

#### 🔧 Key Components Used
```jsx
import { 
  Button, 
  InputNumber, 
  Divider, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Space, 
  Spin, 
  Alert,
  Image,
  Rate,
  Descriptions,
  Badge
} from 'antd';
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd quefarm.client
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Breadcrumb.jsx          # Enhanced breadcrumb with Ant Design
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── ...
├── features/
│   ├── product/
│   │   └── ProductDetail.jsx   # Enhanced product detail page
│   ├── cart/
│   └── category/
├── pages/
└── context/
```

## Routing

The application uses React Router for navigation:

- `/` - Home page
- `/product/:id` - Product detail page with breadcrumb
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/admin/*` - Admin panel

## Styling

- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Ant Design**: React UI library for consistent components
- **Custom CSS**: Additional styling in `src/App.css` and `src/index.css`

## API Integration

The ProductDetail component fetches data from:
- `/api/product/:id` - Product information
- `/api/category` - Category information for breadcrumbs

## Responsive Design

The component is fully responsive with breakpoints:
- **Mobile**: Single column layout
- **Tablet**: Improved spacing and layout
- **Desktop**: Two-column layout with enhanced features

## Future Enhancements

- [ ] Image gallery with multiple product images
- [ ] Product reviews and ratings system
- [ ] Related products section
- [ ] Social sharing functionality
- [ ] Product comparison feature
- [ ] Wishlist management
- [ ] Stock availability indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
