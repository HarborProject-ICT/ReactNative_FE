import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function MainScreen({ navigation }) {
    function pressHandler1() {
        navigation.navigate('로그인');
    }
    function pressHandler2() {
        navigation.navigate('회원가입');
    }
    return (
    <View style={styles.container}>
        <View style={styles.inContainer}>
            <View style={styles.imageContainer}>
            <Text style={styles.text}>입항 알리미</Text> 
            </View>
            <View style={{flex: 0.4}}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={pressHandler1} underlayColor="white">
                <View style={styles.buttonStyle1}>
                    <Text style={styles.buttonText1}>로그인</Text>
                </View>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={pressHandler2} underlayColor="white">
                <View style={styles.buttonStyle2}>
                    <Text style={styles.buttonText2}>회원가입</Text>
                </View>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    </View>
    );
}
/*
<Image source= {require('/Users/nayoungkim/projects/testProject/assets/truck.png')} 
            style={{
            resizeMode: 'cover',
            height: 200,
            width: 200,
          }}/>
*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7198F4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inContainer: {
        flex: 1,
        backgroundColor: '#7198F4',
        borderColor: '#cccccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        flex: 0.6,
        marginTop: 50,
        justifyContent: 'center',
    },
    buttonContainer: {
        margin: 10
    },
    buttonStyle1: {
        alignItems: 'center',
        justifyContent: 'center',
        width : 230,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    buttonStyle2: {
        alignItems: 'center',
        justifyContent: 'center',
        width : 230,
        height: 50,
        backgroundColor: '#7198F4',
        borderColor: 'white',
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth : 1

    },
    buttonText1: {
        fontSize: 20,
        color: 'gray'
    },
    buttonText2: {
        fontSize: 20,
        color: 'white'
    },
    image: {
        width: 300,
        height: 300,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 50,
        textAlign: 'left',
        color: 'white'
    }
});