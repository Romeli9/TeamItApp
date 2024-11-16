import axios from 'axios';
import {CartItemType, Product, User} from 'entities';
import {create} from 'zustand';

export type OrderItem = {
  id: number;
  orderid: number;
  productid: number;
  quantity: number;
  product: Product;
  user: User;
};

export type Order = {
  id: number;
  orderitems: OrderItem[];
};

type OrderStore = {
  orders: Order[];
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isProductOrdered: (productId: number) => boolean;
  makeOrder: (
    items: CartItemType[],
    userid: number,
    token: string,
  ) => Promise<void>;
  getOrders: (userid: number, token: string) => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  isLoading: false,
  orders: [],

  setIsLoading: (isLoading: boolean) => {
    set({isLoading});
  },

  isProductOrdered: (productId: number) => {
    const orders = get().orders;
    return orders?.some(order =>
      order?.orderitems?.some(
        orderItem => orderItem?.product?.id === productId,
      ),
    );
  },

  makeOrder: async (items: CartItemType[], userid: number, token: string) => {
    try {
      const formattedItems = items.map(item => ({
        quantity: item.quantity,
        productid: item.id,
      }));
      const {data} = await axios.post<Order>(
        'https://domennameabcdef.ru/api/orders',
        {
          userid,
          orderItems: formattedItems,
        },
        {
          headers: {
            token,
          },
        },
      );
      set({orders: [...get().orders, data]});
    } catch (error) {
      console.error(error);
    }
  },

  getOrders: async (userid: number, token: string) => {
    try {
      const {data} = await axios.get<Order[]>(
        `https://domennameabcdef.ru/api/orders/${userid}`,
        {
          headers: {
            token: token,
          },
        },
      );

      set({
        orders: data,
      });
    } catch (error: any) {}
  },
}));
