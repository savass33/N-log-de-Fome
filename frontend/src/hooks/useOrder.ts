import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
export const useOrders = (restaurantId: string) => {
  const [orders, setOrders] = useState([]);
  useEffect(() => { /* lógica de fetch de orders */ }, [restaurantId]);
  return { orders };
};