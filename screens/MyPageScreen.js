import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../store/auth-context';
import { getUserEmail, firestore } from '../firebaseConfig';
import { Feather } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyPageScreen = ({ route }) => {
    //const { cargo } = route.params;

    var now = new Date();
    var year = now.getFullYear();
    var todayMonth = now.getMonth() + 1;
    var todayDate = now.getDate();

    const week = ['일', '월', '화', '수', '목', '금', '토'];
    var dayOfWeek = week[now.getDay()];

    const userEmail = getUserEmail();

    const [cargos, setCargos] = useState([]);

    useEffect(() => {
      if (userEmail) {
        // Firebase Firestore에서 cargos 컬렉션 데이터 가져오기
        const docRef = firestore.collection('users').doc(userEmail);
        const cargoList = [];

        docRef.get().then((doc) => {
          if (doc.exists) {
            const cargoData = doc.data();
            setCargos([cargoData]); // Assuming you want to set the data in an array
          } else {
            console.log('No such document!');
          }
        }).catch((error) => {
          console.error('Error getting document:', error);
        });
      }
      AsyncStorage.getItem('isVisible').then((value) => {
        if (value !== null) {
          setIsVisible(value === 'true'); // 값을 불리언으로 변환합니다
          if (!isVisible) {
            setAdditionalMessagesVisible(true); // replyContainer가 나타나면 추가 메시지를 표시
          }
        }
      });
    }, [userEmail]);
  

    const [isVisible, setIsVisible] = useState(false);

    const [additionalMessagesVisible, setAdditionalMessagesVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
      AsyncStorage.setItem('isVisible', 'true');
      if (!isVisible) {
        setAdditionalMessagesVisible(true); // replyContainer가 나타나면 추가 메시지를 표시
      }
    };
    

    const navigation = useNavigation();

    const navigateToMap = () => {
      navigation.navigate('내비게이션');
    };

    return (
      <View style={{flex:1}}>
        <ScrollView>
         <View style={styles.dayContainer}>
          <Text style={styles.dayText}>{year}년 {todayMonth}월 {todayDate}일 ({dayOfWeek})</Text>
        </View>
        <View style={styles.sendContainer1}>
          <View style={styles.inContainer}>
          <Text style={styles.sendText}>안녕하세요. 입항알리미입니다.</Text>
          </View>
        </View>
        <View>
        {cargos.map((item, index) => (
          <View style={styles.sendContainer2} key={index}>
            <View style={styles.inContainer}>
              <Text style={styles.sendText}>화물 {item.cargoName} 건이 </Text>
              <Text style={styles.sendText}>
                {year}년 {todayMonth}월 {todayDate}일 {item.selectedHour}시 {item.selectedTime}분
              </Text>
              <Text style={styles.sendText}>도착 예약되었습니다.</Text>
              <Text style={styles.sendText}>출발 전 출발 버튼을 눌러주세요.</Text>
            </View>
          </View>
        ))}
        </View>
        {isVisible && <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>지금 출발합니다.</Text>
          </View>
        </View>
        }
        {additionalMessagesVisible && 
        <View>
        <View style={styles.sendContainer3}>
          {cargos.map((item, index) => ( 
          <View style={styles.inContainer}>
            <Text style={styles.sendText}>{userEmail}님, 화물 {item.cargoName} 건의 </Text>
            <Text style={styles.sendText}>최적 항만 입항 시간은 00시 00분 입니다.</Text>
          </View>))}
        </View>
        <View style={styles.sendContainer3}>
        <View style={styles.inContainer}>
          <Text style={styles.sendText}>현재 항만 상태가 매우 혼잡하오니</Text>
          <Text style={styles.sendText}>00분 이후 출발 하시는 것을 권고드립니다.</Text>
        </View>
      </View>
      </View> 
        }
        
        </ScrollView>
        <View style={styles.goContainer}>
          <TouchableOpacity onPress={toggleVisibility} underlayColor="white">
            <View style={styles.ingoContainer}>
            <View style={{marginRight: 20}}>
            <Text style={styles.goText}>지금 출발</Text>
            </View>
            <View>
              <Feather name="send" size={24} color="black" />
            </View>
            </View>
          </TouchableOpacity>
          
          
            <View style={styles.ingoContainer}>
            <TouchableOpacity style={{flex:1, flexDirection:'row', marginLeft: 50}} onPress={navigateToMap} underlayColor="white">
            <View style={{marginRight: 20}}>
            <Text style={styles.goText}>map</Text>
            </View>
            <View>
              <Feather name="map-pin" size={24} color="black" />
            </View>
            </TouchableOpacity>
            </View>
          
        </View>
      </View>
    );
  };
  

  const styles = StyleSheet.create({
    dayContainer: {
      marginTop : 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    dayText: {
      fontSize: 15
    },
    sendContainer1: {
      marginTop : 30,
      marginLeft : 30,
      justifyContent: 'center',
      borderRadius: 20,
      backgroundColor: '#D9D9D9',
      width: 260,
      height: 50,
    },
    sendContainer2: {
      marginTop : 30,
      marginLeft : 30,
      justifyContent: 'center',
      borderRadius: 20,
      backgroundColor: '#D9D9D9',
      width: 300,
      height: 120,
    },
    sendContainer3: {
      marginTop : 30,
      marginLeft : 30,
      justifyContent: 'center',
      borderRadius: 20,
      backgroundColor: '#D9D9D9',
      width: 330,
      height: 65,
    },
    sendText: {
      fontSize: 15
    },
    inContainer: {
      marginLeft : 30,
      marginTop : 15,
      flex: 1,
    },
    goContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    goText: {
      fontSize: 18,
    },
    ingoContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      height: 50,
      width: 180,
      backgroundColor: '#dddddd',
      borderRadius: 20,
      shadowColor: '#000',
    },
    buttonContainer: {
      margin: 13
    },
    replyContainer: {
      backgroundColor:'#7198F4',
      justifyContent: 'center',
      marginTop : 30,
      marginRight : 30,
      height: 50,
      width: 140,
      borderRadius: 20,
    },
    replyText: {
      color: 'white',
      marginLeft: 20,
      fontSize: 15
    }
  });

export default MyPageScreen;