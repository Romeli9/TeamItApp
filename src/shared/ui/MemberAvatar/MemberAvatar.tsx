import {useEffect, useState} from 'react';
import {Image} from 'react-native';

import {getFileUrl} from 'api';
import {getUserById} from 'services/getUserById';

import {MemberAvatarStyles as styles} from './MemberAvatar.styles';

export const MemberAvatar: React.FC<{userId: string; num: number}> = ({
  userId,
  num,
}) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserById(userId);
        const imageUrl = await getFileUrl(userData.avatar);
        setUser({...userData, avatar: imageUrl});
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user || !user.avatar) {
    return null;
  }

  return (
    <>
      {user.avatar && num === 1 ? (
        <Image source={{uri: user.avatar}} style={styles.required_image_2} />
      ) : (
        <Image source={{uri: user.avatar}} style={styles.author_image} />
      )}
    </>
  );
};
