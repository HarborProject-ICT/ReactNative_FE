import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../store/auth-context';
import { getUserEmail, firestore } from '../firebaseConfig';

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
        const cargoCollectionRef = firestore.collection('users').doc(userEmail).collection('cargos');
  
        cargoCollectionRef.get()
          .then((querySnapshot) => {
            const cargoList = [];
            querySnapshot.forEach((doc) => {
              const cargoData = doc.data();
              cargoList.push(cargoData);
            });
            setCargos(cargoList);
          })
          .catch((error) => {
            console.error('Error fetching cargos:', error);
          });
      }
    }, []);
  



    return (
      <View>
         <View style={styles.dayContainer}>
          <Text style={styles.dayText}>{year}년 {todayMonth}월 {todayDate}일 ({dayOfWeek})</Text>
        </View>
        <View style={styles.sendContainer1}>
          <View style={styles.inContainer}>
          <Text style={styles.sendText}>안녕하세요. 입항알리미입니다.</Text>
          </View>
        </View>
        <FlatList
        data={cargos}
        keyExtractor={(item, index) => index.toString()} // 고유 키 설정
        renderItem={({ item }) => (
          <View style={styles.sendContainer2}>
            <View style={styles.inContainer}>
            <Text style={styles.sendText}>화물 {item.cargoName} 건이 </Text>
            <Text style={styles.sendText}>{year}년 {todayMonth}월 {todayDate}일 {item.selectedHour}시 {item.selectedTime}분</Text>
            <Text style={styles.sendText}>도착 예약되었습니다.</Text>
            <Text style={styles.sendText}>출발 전 출발 버튼을 눌러주세요.</Text>
            </View>
          </View>
        )}
      />
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
      fontStyle: 'bold',
      fontSize: 20
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
    sendText: {
      fontSize: 15
    },
    inContainer: {
      marginLeft : 30,
    }
  });

export default MyPageScreen;