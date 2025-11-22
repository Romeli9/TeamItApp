import React from 'react';

import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';

export const AchievementIcons: any = {
  starOutline: (props: any) => <Feather name="star" {...props} />,
  award: (props: any) => <Feather name="award" {...props} />,
  crown: (props: any) => <MaterialCommunityIcons name="crown" {...props} />,
  users: (props: any) => <Feather name="users" {...props} />,
};
