import { User, Role, Product, Order } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Ali',
    email: 'ahmed.ali@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sara Mohamed',
    email: 'sara.mohamed@example.com',
    role: 'Manager',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Omar Hassan',
    email: 'omar.hassan@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Fatima Ibrahim',
    email: 'fatima.ibrahim@example.com',
    role: 'User',
    status: 'inactive',
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    name: 'Khalid Mahmoud',
    email: 'khalid.mahmoud@example.com',
    role: 'Manager',
    status: 'active',
    createdAt: '2024-02-28',
  },
];

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: ['users.read', 'users.write', 'roles.read', 'roles.write', 'products.read', 'products.write', 'orders.read', 'orders.write'],
    userCount: 1,
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Manage products and orders',
    permissions: ['products.read', 'products.write', 'orders.read', 'orders.write', 'users.read'],
    userCount: 2,
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic access',
    permissions: ['products.read', 'orders.read'],
    userCount: 2,
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro 15',
    price: 1299.99,
    quantity: 45,
    category: 'Electronics',
    status: 'in_stock',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    price: 29.99,
    quantity: 150,
    category: 'Accessories',
    status: 'in_stock',
    createdAt: '2024-02-15',
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    price: 89.99,
    quantity: 3,
    category: 'Accessories',
    status: 'low_stock',
    createdAt: '2024-03-01',
  },
  {
    id: '4',
    name: '4K Monitor 27"',
    price: 399.99,
    quantity: 0,
    category: 'Electronics',
    status: 'out_of_stock',
    createdAt: '2024-01-20',
  },
  {
    id: '5',
    name: 'USB-C Hub',
    price: 49.99,
    quantity: 78,
    category: 'Accessories',
    status: 'in_stock',
    createdAt: '2024-02-10',
  },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Ahmed Ali',
    customerEmail: 'ahmed.ali@example.com',
    total: 1329.98,
    status: 'delivered',
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Sara Mohamed',
    customerEmail: 'sara.mohamed@example.com',
    total: 89.99,
    status: 'shipped',
    createdAt: '2024-03-18',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Omar Hassan',
    customerEmail: 'omar.hassan@example.com',
    total: 399.99,
    status: 'processing',
    createdAt: '2024-03-20',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Fatima Ibrahim',
    customerEmail: 'fatima.ibrahim@example.com',
    total: 49.99,
    status: 'pending',
    createdAt: '2024-03-21',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Khalid Mahmoud',
    customerEmail: 'khalid.mahmoud@example.com',
    total: 29.99,
    status: 'cancelled',
    createdAt: '2024-03-19',
  },
];



