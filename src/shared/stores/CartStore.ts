import axios from 'axios';
import {CartItemType, ICartFromServer, Product} from 'entities';
import {Point} from 'features/MapInfo/model/store';
import {storage} from 'shared/libs/storage';
import {create} from 'zustand';

const makePatchRequest = async (
  token: string,
  id: number,
  items: CartItemType[],
) => {
  try {
    const formattedItems = items.map(item => ({
      quantity: item.quantity,
      productId: item.id,
    }));

    const {data} = await axios.patch(
      'https://domennameabcdef.ru/api/basket',
      {
        id,
        items: formattedItems,
      },
      {
        headers: {
          token,
        },
      },
    );

    if (data?.basket?.basketItems) {
      return data;
    }
  } catch (error: any) {
    console.error(error.response);
  }
};

type CartStore = {
  id: number;
  items: CartItemType[];
  isLoading: boolean;

  selectedPoint: Point | null;
  setSelectedPoint: (point: Point) => void;
  fetchSelectedPoint: () => void;
  clearSelectedPoint: () => void;

  setIsLoading(isLoading: boolean): void;
  getItemQuantity: (id: number) => number;

  getItems: (token: string, id: number) => Promise<void>;
  addItem: (item: CartItemType, token: string, id: number) => Promise<void>;
  removeItem: (id: number, token: string, userid: number) => Promise<void>;
  incrementItem: (id: number, token: string, userid: number) => Promise<void>;
  decrementItem: (id: number, token: string, userid: number) => Promise<void>;
  clearCart: (token: string, userid: number) => Promise<void>;
  getItemById: (id: number, token: string) => Promise<CartItemType | undefined>;
  getProductById: (id: number) => Promise<Product | undefined>;
  setBasket: (basket: ICartFromServer) => void;
  loadBasket: () => Promise<void>;
};

export const useCartStore = create<CartStore>(set => ({
  id: 0,
  items: [],
  isLoading: true,

  selectedPoint: null,

  setSelectedPoint: (point: Point) => {
    set({selectedPoint: point});
    storage.set('point', JSON.stringify(point));
  },

  fetchSelectedPoint: () => {
    const pointString = storage.getString('point');
    if (pointString) {
      const pointObj = JSON.parse(pointString);

      set({selectedPoint: pointObj});
    }
  },

  clearSelectedPoint: () => {
    set({selectedPoint: null});
    storage.set('point', JSON.stringify(null));
  },

  setIsLoading: (isLoading: boolean) => set({isLoading}),

  getItemQuantity: (id: number): number => {
    const {items} = useCartStore.getState();
    const item = items.find(item => item.id === id);
    return item ? item.quantity : 0;
  },

  getItems: async (token: string, id: number) => {
    try {
      const {data} = await axios.get('https://domennameabcdef.ru/api/basket', {
        params: {
          id,
        },
        headers: {
          token: token,
        },
      });

      if (data?.basket?.basketItems) {
        const basketItems = data.basket.basketItems;

        const detailedItems = await Promise.all(
          basketItems.map(
            async (basketItem: {productid: number; quantity: number}) => {
              const itemDetails = await useCartStore
                .getState()
                .getItemById(basketItem.productid, token);

              if (itemDetails) {
                return {
                  ...itemDetails,
                  quantity: basketItem.quantity,
                };
              }
              return null;
            },
          ),
        );

        const filteredItems = detailedItems.filter(item => item !== null);
        set({items: filteredItems as CartItemType[]});
      } else {
        console.error('Ошибка при получении корзины');
      }
    } catch (error: any) {
      console.error('Ошибка при получении корзины:', error);
    }
  },

  addItem: async (item: CartItemType, token: string, id: number) => {
    const newItems = [...useCartStore.getState().items, item];
    try {
      const data = await makePatchRequest(token, id, newItems);

      if (data?.basket?.basketItems) {
        const basketItems = data.basket.basketItems;
        const detailedItems = await Promise.all(
          basketItems.map(
            async (basketItem: {productid: number; quantity: number}) => {
              const itemDetails = await useCartStore
                .getState()
                .getItemById(basketItem.productid, token);
              if (itemDetails) {
                return {
                  ...itemDetails,
                  quantity: basketItem.quantity,
                };
              }
              return null;
            },
          ),
        );

        // Оставляем только успешные элементы
        const filteredItems = detailedItems.filter(item => item !== null);
        set({items: filteredItems as CartItemType[]});
      } else {
        console.error('Ошибка при добавлении товара в корзину');
      }
    } catch (error) {
      console.error(error);
    }
  },

  removeItem: async (idItem: number, token: string, idCart: number) => {
    const newItems = useCartStore
      .getState()
      .items.filter(item => item.id !== idItem);

    try {
      const data = await makePatchRequest(token, idCart, newItems);
      if (data?.basket?.basketItems) {
        set({items: newItems});
      } else {
        console.error('Ошибка при удалении из корзины');
      }
    } catch (error) {
      console.error(error);
    }
  },

  incrementItem: async (idItem: number, token: string, idCart: number) => {
    set(state => {
      const updatedItems = state.items.map(item =>
        item.id === idItem ? {...item, quantity: item.quantity + 1} : item,
      );

      makePatchRequest(token, idCart, updatedItems)
        .then(data => {
          if (data?.basket?.basketItems) {
            set({items: updatedItems});
          } else {
            console.error('Ошибка при обновлении количества товара в корзине');
          }
        })
        .catch(error => {
          console.error(error);
        });

      return {items: updatedItems};
    });
  },

  decrementItem: async (idItem: number, token: string, idCart: number) => {
    set(state => {
      const updatedItems = state.items.map(item =>
        item.id === idItem && item.quantity > 1
          ? {...item, quantity: item.quantity - 1}
          : item,
      );

      makePatchRequest(token, idCart, updatedItems)
        .then(data => {
          if (data?.basket?.basketItems) {
            set({items: updatedItems});
          } else {
            console.error('Ошибка при обновлении количества товара в корзине');
          }
        })
        .catch(error => {
          console.error(error);
        });

      return {items: updatedItems};
    });
  },

  clearCart: async (token: string, id: number) => {
    try {
      const data = await makePatchRequest(token, id, []);
      if (data?.basket?.basketItems) {
        set({items: data.basket.basketItems});
      } else {
        console.error('Ошибка при очистке корзины');
      }
    } catch (error) {
      console.error(error);
    }
  },

  getItemById: async (id: number, token: string) => {
    try {
      const {data} = await axios.get(`https://domennameabcdef.ru/api/product`, {
        params: {
          id,
        },
        headers: {
          token,
        },
      });

      return {
        id: data.id,
        title: data.name,
        price: data.new_price || data.price,
        images: data.images,
        quantity: 1,
      } as CartItemType;
    } catch (error: any) {
      console.error(error.response);
      console.error(`Ошибка при получении товара с id ${id}:`, error);
    }
  },

  getProductById: async (id: number) => {
    try {
      const {data} = await axios.get(`https://domennameabcdef.ru/api/product`, {
        params: {
          id,
        },
      });

      return data;
    } catch (error: any) {
      console.error(error.response);
      console.error(`Ошибка при получении товара с id ${id}:`, error);
    }
  },

  setBasket: basket => {
    storage.set('basket', JSON.stringify(basket));
    set({id: basket.id});
  },

  loadBasket: async () => {
    const basketString = storage.getString('basket');
    if (basketString) {
      const basketObj = JSON.parse(basketString);
      set({id: basketObj.id});
    }
  },
}));
