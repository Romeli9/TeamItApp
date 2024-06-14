import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FireBaseConfig';

const Search: React.FC<any> = ({ route, navigation }) => {

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#EAEAEA' }}>



            </View>
        </SafeAreaProvider>
    )
}


export default Search;