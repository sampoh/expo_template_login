// import {Fragment} from 'react'
import {StyleSheet,View} from 'react-native';
import {Text,Button} from '@rneui/themed';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage'

//実装
import {getSessionName,typeSession,globalInfo,setGlobal} from './Cast';

//expoデバッグ用
import {StatusBar} from 'expo-status-bar';

type logoutIO = {
    setSessionInfo:React.Dispatch<React.SetStateAction<typeSession>>
}

export default function Main({setSessionInfo}:logoutIO) {
  return (
    <View style={styles.container}>
      <Text h3 h3Style={{marginBottom:60}}>Logged in</Text>
      <Button
        size="lg"
        buttonStyle={{
          borderWidth:0,
          borderRadius: 30,
        }}
        containerStyle={{
          width:180,
          marginTop:30,
          marginBottom:70
        }}
        onPress={(ev)=>LogoutComm(setSessionInfo)}
        color="error">LOGOUT</Button>
      <StatusBar style="auto" />
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
});

//ログアウト処理
function LogoutComm(setSessionInfo:React.Dispatch<React.SetStateAction<typeSession>>){
    let sessionName = getSessionName();
    AsyncStorage.getItem(sessionName,(err,testid) =>{

        if(err !== null){ console.log(err) }

        console.log(globalInfo);
        setGlobal('{"hasSession":false}');
        console.log(globalInfo);
        setSessionInfo((prev)=>({...prev,...{hasSession:false}}));
        let headerId:string = (testid === null) ? "" : "" + testid;
        let headerJson:string = getSessionName('JSON',headerId);
        let myUrl = 'https://local.rna.co.jp/test/react_logout.php';
        fetch(myUrl,{mode:'cors',headers:JSON.parse(headerJson)})
        .then(res => {
            console.log('HTTP CODE : ' + res.status);
            return res.json();
        }).then(content => {
            console.log(content)
            AsyncStorage.setItem(sessionName,'');
            setGlobal('{"sessionId":"","hasSession":false}');
            setSessionInfo((prev)=>({...prev,...{status:'loaded',loaded:true,hasSession:false}}));
        });

    });
}