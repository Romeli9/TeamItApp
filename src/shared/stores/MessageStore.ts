import {create} from 'zustand';

type MessageStore = {
  modalImageVisible: boolean;
  selectedImage: string | null;

  setModalImageVisible: (value: boolean) => void;
  setSelectedImage: (value: string | null) => void;
};

export const useMessageStore = create<MessageStore>(set => ({
  modalImageVisible: false,
  selectedImage: null,

  setModalImageVisible: (value: boolean) => {
    set({modalImageVisible: value});
  },

  setSelectedImage: (value: string | null) => {
    set({selectedImage: value});
  },
}));
