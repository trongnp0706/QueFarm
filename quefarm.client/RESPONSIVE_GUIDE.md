# QueFarm - Responsive Design Guide

## Tổng quan
Ứng dụng QueFarm đã được tối ưu hóa để responsive tốt trên các thiết bị tablet và mobile, sử dụng Tailwind CSS và Ant Design.

## Breakpoints được sử dụng

### Mobile First Approach
- **xs**: 0px - 639px (Mobile)
- **sm**: 640px - 767px (Large Mobile)
- **md**: 768px - 1023px (Tablet)
- **lg**: 1024px - 1279px (Small Desktop)
- **xl**: 1280px - 1535px (Desktop)
- **2xl**: 1536px+ (Large Desktop)

## Các cải tiến chính

### 1. Header Component
- **Mobile Menu**: Drawer menu với navigation đầy đủ
- **Responsive Logo**: Kích thước logo thay đổi theo màn hình
- **Search Bar**: Ẩn trên mobile, hiện dưới header
- **Cart Button**: Responsive với badge số lượng

### 2. Product Grid
- **Grid Layout**: 
  - Mobile: 1 cột
  - Small: 2 cột
  - Tablet: 3 cột
  - Desktop: 4-5 cột
- **Card Design**: Hover effects và quick view overlay
- **Image Aspect Ratio**: 1:1 với responsive sizing

### 3. Category Menu
- **Desktop**: Flex wrap layout
- **Mobile/Tablet**: Horizontal scroll với scrollbar ẩn
- **Touch Friendly**: Buttons có kích thước phù hợp cho touch

### 4. Product Detail
- **Layout**: Stack layout trên mobile, side-by-side trên desktop
- **Image Gallery**: Responsive image với zoom effect
- **Actions**: Buttons stack trên mobile, inline trên desktop

### 5. Cart Component
- **Layout**: Single column trên mobile, 2-3 columns trên desktop
- **Order Summary**: Sticky sidebar trên desktop
- **Quantity Controls**: InputNumber với validation

### 6. Banner Component
- **Layout**: Stack trên mobile, side-by-side trên desktop
- **Content**: Responsive text sizing và spacing
- **Icons**: Responsive icon sizing

### 7. Footer Component
- **Grid Layout**: 1 column mobile, 2 columns tablet, 3 columns desktop
- **Content**: Responsive text và spacing
- **Contact Info**: Optimized cho mobile viewing

## Floating Action Button
- **Scroll to Top**: Nút cuộn lên đầu trang
- **Phone Call**: Nút gọi điện trực tiếp
- **Cart Access**: Nút truy cập giỏ hàng với badge

## CSS Utilities

### Custom Classes
```css
.scrollbar-hide          /* Ẩn scrollbar cho horizontal scroll */
.line-clamp-1/2/3       /* Giới hạn số dòng text */
.container-responsive    /* Responsive container */
.fade-in                /* Animation fade in */
.touch-friendly         /* Touch-friendly buttons */
```

### Ant Design Overrides
- Responsive button sizing
- Mobile-optimized input fields
- Drawer width optimization

## Performance Optimizations

### 1. Image Optimization
- Responsive image sizing
- Lazy loading support
- Optimized aspect ratios

### 2. Touch Interactions
- Minimum 44px touch targets
- Smooth transitions
- Hover states cho desktop

### 3. Loading States
- Skeleton loading cho products
- Spinner animations
- Error handling với retry buttons

## Accessibility Features

### 1. Focus Management
- Visible focus indicators
- Keyboard navigation support
- Screen reader friendly

### 2. Color Contrast
- WCAG compliant color ratios
- High contrast mode support
- Clear visual hierarchy

### 3. Touch Targets
- Minimum 44px touch targets
- Adequate spacing between elements
- Clear visual feedback

## Testing Checklist

### Mobile (320px - 767px)
- [ ] Header menu hoạt động đúng
- [ ] Product grid hiển thị 1-2 cột
- [ ] Touch interactions mượt mà
- [ ] Text readable không cần zoom
- [ ] Buttons có kích thước phù hợp

### Tablet (768px - 1023px)
- [ ] Layout tối ưu cho landscape/portrait
- [ ] Product grid hiển thị 3 cột
- [ ] Navigation menu accessible
- [ ] Forms dễ sử dụng

### Desktop (1024px+)
- [ ] Full layout hiển thị đúng
- [ ] Hover effects hoạt động
- [ ] Sidebar layouts stable
- [ ] Performance mượt mà

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Improvements
1. **PWA Support**: Service workers và offline functionality
2. **Advanced Animations**: Framer Motion integration
3. **Dark Mode**: Theme switching capability
4. **Internationalization**: Multi-language support
5. **Advanced Filters**: Product filtering và sorting 