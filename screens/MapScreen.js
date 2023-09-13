import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/auth-context';

import { StyleSheet, Text, View, } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { auth } from '../firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';



const mapScreen = ({navigation}) => {
    const tmapApiKey = '7pZ0VTmnmx1U46s2sVM5U3cNVnqMwlwKFRP678Tc'; // 여기에 자신의 Tmap API 키를 입력하세요.

  return (
    <WebView
      source={{
        uri: `https://apis.openapi.sk.com/tmap/index.html?key=${tmapApiKey}`,
      }}
    />
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'blue',
    }
});

export default mapScreen;