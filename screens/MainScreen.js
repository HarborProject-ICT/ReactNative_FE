import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';


export default function MainScreen({ navigation }) {
    function pressHandler() {
        navigation.navigate('로그인');
    }
    return (
    <View style={styles.container}>
        <View style={styles.inContainer}>
            <View style={styles.imageContainer}>
            <Image source= {require('/Users/nayoungkim/projects/testProject/assets/truck.png')} 
            style={{
            resizeMode: 'cover',
            height: 200,
            width: 200,
          }}/>
            <Text style={styles.text}>입항 알리미</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={pressHandler} underlayColor="white">
                <View style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>로그인/회원가입</Text>
                </View>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inContainer: {
        flex: 1,
        margin: 100,
        backgroundColor: '#fff',
        borderColor: '#cccccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        flex: 3,
        marginTop: 50,
        justifyContent: 'center',
    },
    buttonContainer: {
        flex: 1,
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width : 230,
        height: 50,
        backgroundColor: '#63ace5',
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
    image: {
        width: 300,
        height: 300,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center'
    }
});