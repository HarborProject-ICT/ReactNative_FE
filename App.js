import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ReserveScreen from './screens/ReserveScreen';
import MyPageScreen from './screens/MyPageScreen';
import MapScreen from './screens/MapScreen';

import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import IconButton from './components/ui/IconButton';
import { getUserEmail } from './firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from 'react-native';

  
const Stack = createNativeStackNavigator();


function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#7198F4' },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}}/>
      <Stack.Screen name="로그인" component={LoginScreen} />
      <Stack.Screen name="회원가입" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const onPressNavigate = ({ navigation }) => (
    navigation.navigate('마이페이지')
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#7198F4' },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="화물 배정" component={WelcomeScreen} 
      options={{title: '화물 배정', 
      headerRight: ({tintColor}) => (
        <MaterialCommunityIcons name="message-text-outline" size={30} color="white" onPress={() => navigation.navigate('마이페이지')}/>
      )}}/>
      <Stack.Screen name="화물 배정 시간 예약" component={ReserveScreen}/>
      <Stack.Screen name="마이페이지" component={MyPageScreen}
      options={{
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="exit"
            color={tintColor}
            size={24}
            onPress={authCtx.logout}
          />
        ),
        headerTitle: ({ tintColor }) => (
          <Text style={{color: tintColor, fontSize : 25}}>{getUserEmail()}</Text>
        ),
      }}/>
      <Stack.Screen name="내비게이션" component={MapScreen}/>
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}

