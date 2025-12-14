// Address schema structure
export const addressSchema = {
  id: '',
  label: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

// Order status types
export const ORDER_STATUSES = [
  "Order Placed",
  "Picked Up",
  "Processing",
  "Washing",
  "Ironing",
  "Ready",
  "Out for Delivery",
  "Delivered",
];

// Order item structure
export const orderItemSchema = {
  garment: '',
  quantity: 0,
  price: 0,
  serviceType: '',
};

// Price item structure  
export const priceItemSchema = {
  garment: '',
  price: 0,
  icon: '',
};

// User roles
export const USER_ROLES = ['customer', 'admin'];

// Service categories
export const SERVICE_CATEGORIES = [
  'Wash & Fold',
  'Wash & Iron', 
  'Dry Clean',
  'Steam Iron',
  'Premium Care',
];

// Coupon types
export const COUPON_TYPES = ['percentage', 'fixed'];
