import React from 'react';

import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

// Feather = легкие, острые и понятные
// MaterialCommunityIcons = больше вариаций, если нет в Feather
// Ionicons/MaterialIcons — если нужно точное соответствие

export const CartIcon = (props: any) => (
  <Feather name="shopping-cart" {...props} />
);
export const HomeIcon = (props: any) => <Feather name="home" {...props} />;
export const CatalogIcon = (props: any) => <Feather name="book" {...props} />;
export const ProfileIcon = (props: any) => <Feather name="user" {...props} />;
export const CardIcon = (props: any) => (
  <Feather name="credit-card" {...props} />
);
export const ForwardIcon = (props: any) => (
  <Feather name="chevron-right" {...props} />
);
export const LogOutIcon = (props: any) => <Feather name="log-out" {...props} />;
export const HistoryIcon = (props: any) => (
  <Feather name="archive" {...props} />
);
export const SettingsIcon = (props: any) => (
  <Feather name="settings" {...props} />
);
export const HeartOutlineIcon = (props: any) => (
  <Feather name="heart" {...props} />
);
export const PenOutlineIcon = (props: any) => (
  <Feather name="edit" {...props} />
);
export const CopyOutlineIcon = (props: any) => (
  <Feather name="copy" {...props} />
);
export const SearchIcon = (props: any) => <Feather name="search" {...props} />;
export const CloseIcon = (props: any) => <Feather name="x" {...props} />;
export const CloseCircleIcon = (props: any) => (
  <MaterialIcons name="cancel" {...props} />
);
export const ProductIcon = (props: any) => <Feather name="gift" {...props} />;
export const ReviewIcon = (props: any) => <Feather name="award" {...props} />;
export const MessageIcon = (props: any) => (
  <Feather name="message-circle" {...props} />
);
export const TrashIcon = (props: any) => <Feather name="trash-2" {...props} />;
export const AddImgIcon = (props: any) => (
  <Feather name="file-plus" {...props} />
);
export const SendIcon = (props: any) => <Feather name="send" {...props} />;
export const PlusSquareIcon = (props: any) => (
  <Feather name="plus-square" {...props} />
);
export const CubeIcon = (props: any) => <Feather name="box" {...props} />;
export const HeartFilledIcon = (props: any) => (
  <Feather name="heart" {...props} />
);
export const ArrowBack = (props: any) => (
  <Ionicons name="arrow-back" {...props} />
);
export const MapIcon = (props: any) => <Feather name="map" {...props} />;
export const StarIcon = (props: any) => <Feather name="star" {...props} />;
export const RemoveIcon = (props: any) => <Feather name="trash" {...props} />;
export const FlagIcon = (props: any) => <Feather name="flag" {...props} />;
export const BackIcon = (props: any) => (
  <Ionicons name="arrow-back" {...props} />
);
export const CheckIcon = (props: any) => <Feather name="check" {...props} />;
export const DoubleCheckIcon = (props: any) => (
  <MaterialIcons name="done-all" {...props} />
);
export const AlertIcon = (props: any) => (
  <Feather name="alert-circle" {...props} />
);
export const ArrowLeftIcon = (props: any) => (
  <Feather name="arrow-left" {...props} />
);
export const ArrowRightIcon = (props: any) => (
  <Feather name="arrow-right" {...props} />
);
export const PlusIcon = (props: any) => <Feather name="plus" {...props} />;

export const EditProfileIcon = (props: any) => (
  <FontAwesome name="edit" size={36} color="black" />
);

export const ExitIcon = (props: any) => (
  <MaterialIcons name="exit-to-app" size={36} color="black" />
);

export const UpCaretIcon = (props: any) => (
  <AntDesign name="caretup" size={24} color="black" />
);

export const DownCaretIcon = (props: any) => (
  <AntDesign name="caretdown" size={24} color="black" />
);
