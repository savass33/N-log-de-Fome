import { useState, useEffect, useCallback } from "react";
import { orderService } from "../services/orderService";
import { type IOrder } from "../interfaces/IOrder";

export const useOrders = (restaurantId?: string) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: IOrder[];
      if (restaurantId) {
        data = await orderService.getOrdersByRestaurant(restaurantId);
      } else {
        data = await orderService.getAllOrders();
      }
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar pedidos.");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refreshOrders: fetchOrders };
};
