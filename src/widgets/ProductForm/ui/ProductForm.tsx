import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Product} from 'entities/product';
import {ListingProduct} from 'features/ProductListing';
import {useSearchCatalogStore} from 'features/Search';
import {launchImageLibrary} from 'react-native-image-picker';
import {PlusIcon, TrashIcon} from 'shared/icons';
import {Colors, IconStyles, TextStyles} from 'shared/libs/helpers';
import {Carousel, CustomDropdown, Input} from 'shared/ui';

import {ProductFormStyles as styles} from './ProductForm.styles';

type ProductFormProps = {
  loading: boolean;
  mode: 'create' | 'edit';
  initialProduct?: Product;
  onSubmit: (product: ListingProduct) => void;
};

export const ProductForm = ({
  mode,
  loading,
  initialProduct,
  onSubmit,
}: ProductFormProps) => {
  const {t} = useTranslation();
  const {categories} = useSearchCatalogStore();
  const [product, setProduct] = useState<any>(
    initialProduct || {
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      userId: 0,
    },
  );

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const handleNameChange = (value: string) => {
    setProduct({...product, name: value});
  };

  const handleDescriptionChange = (value: string) => {
    setProduct({...product, description: value});
  };

  const handlePriceChange = (value: string) => {
    setProduct({...product, price: value});
  };

  const handleCategoryChange = (value: string) => {
    setProduct({...product, category: value});
  };

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          const {uri} = response.assets[0];
          if (uri) {
            if (mode === 'edit') {
              setProduct({
                ...product,
                images: [...product.images, {id: uri, image: uri}],
              });
            } else if (mode === 'create') {
              setProduct({...product, image: uri});
            }
          }
        }
      },
    );
  };

  const handleRemoveImage = () => {
    setProduct({...product, image: ''});
  };

  const handleSubmit = () => {
    if (
      !product.name ||
      !product.description ||
      !product.price ||
      !product.category
    ) {
      Alert.alert(t('Заполните все поля'));
      return;
    }
    onSubmit(product);
  };

  const renderImageSection = () => {
    if (mode === 'create') {
      return product.image ? (
        <>
          <TouchableOpacity
            onPress={handleRemoveImage}
            style={styles.iconContainer}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('Удалить изображение')}>
            <TrashIcon
              fill={Colors.Gray500}
              width={IconStyles.medium.width}
              height={IconStyles.medium.height}
              accessible={true}
              accessibilityLabel={t('Предварительный просмотр изображения')}
            />
          </TouchableOpacity>
          <Image source={{uri: product.image}} style={styles.imagePreview} />
        </>
      ) : (
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.imageContainer}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('Добавить новое изображение')}>
          <Text style={TextStyles.p1.changeColor(Colors.Gray500)}>
            {t('Добавить изображение')}
          </Text>
        </TouchableOpacity>
      );
    } else if (mode === 'edit') {
      return (
        <>
          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.iconContainer}>
            <PlusIcon
              fill={Colors.Gray500}
              width={IconStyles.large.width}
              height={IconStyles.large.height}
            />
          </TouchableOpacity>
          <Carousel images={[...product.images]} />
        </>
      );
    }
  };

  const buttonText =
    mode === 'create' ? t('Добавить продукт') : t('Сохранить изменения');

  return (
    <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.imageContainer}>{renderImageSection()}</View>
      <View style={styles.inputs}>
        {mode === 'edit' && (
          <View>
            <Text style={TextStyles.p1.changeColor(Colors.Gray500)}>
              {t('Редактирование описания временно отключено')}
            </Text>
          </View>
        )}
        <CustomDropdown
          data={categories}
          value={product.category}
          onChange={handleCategoryChange}
          placeholder={t('Категория')}
          disabled={mode === 'edit'}
        />
        <Input
          accessibilityLabel={`${t('Введите')} ${t('Название продукта')}`}
          placeholder={t('Название продукта')}
          value={product.name}
          setValue={handleNameChange}
          containerStyle={styles.input}
          disabled={mode === 'edit'}
        />
        <Input
          accessibilityLabel={`${t('Введите')} ${t('Описание продукта')}`}
          placeholder={t('Описание продукта')}
          value={product.description}
          setValue={handleDescriptionChange}
          style={styles.textarea}
          containerStyle={styles.input}
          multiline={true}
          numberOfLines={5}
          disabled={mode === 'edit'}
        />
        <Input
          accessibilityLabel={`${t('Введите')} ${t('Цена')}`}
          placeholder={t('Цена')}
          value={product.price.toString()}
          setValue={handlePriceChange}
          keyboardType="numeric"
          containerStyle={styles.input}
          disabled={mode === 'edit'}
        />
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, styles.filled]}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.White100}
              style={styles.loader}
            />
          ) : (
            <Text style={TextStyles.button1} accessibilityLabel={buttonText}>
              {buttonText}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
