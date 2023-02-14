import * as React from 'react';
// import { Button, Text, TextInput, View, StyleSheet } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from '@rneui/themed';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage'

//実装
import Login from './components/Login';
import Main from './components/Main';
import Loading from './components/Loading';
import {getSessionName,typeSession,globalInfo,setGlobal} from './components/Cast';

//expoデバッグ用
import {StatusBar} from 'expo-status-bar';

//初期通信 ( セッションチェック )
function checkSession(sessionInfo:typeSession,setSessionInfo:React.Dispatch<React.SetStateAction<typeSession>>){

  if(sessionInfo.status === 'before'){
    let sessionName = getSessionName();
    AsyncStorage.getItem(sessionName,(err,testid) =>{

      console.log('[ App is loading ]');
      if(err !== null){ console.log(err) }
      let headerId:string = (testid === null) ? "" : "" + testid;
      let headerJson:string =getSessionName('JSON',headerId);
      console.log(headerJson);
      let req:string = 'https://local.rna.co.jp/test/react_check_session.php';
  
      fetch(req,{mode:'cors',headers:JSON.parse(headerJson)}).then(temp =>temp.json())
      .then(res =>{
        console.log('Response of "' + req + '"',res);
        AsyncStorage.setItem(sessionName,res.testid);
        setGlobal('{"sessionId":"' + res.testid + '","hasSession":' + res.hasSession + '}');
        setSessionInfo((prev)=>({...prev,...{status:'loaded',loaded:true,hasSession:res.hasSession}}));
      }).catch(err => {
        console.log(err);
        setSessionInfo((prev)=>({...prev,...{status:'failed',loaded:false}}));
      })
        
    });

  }

}

function App() {

  const [sessionInfo,setSessionInfo] = React.useState<typeSession>({
    status:"before",
    loaded:false,
    hasSession:false});

  console.log('sessionInfo = ',sessionInfo);

  if(sessionInfo.status === 'loaded'){
    //セッションチェック済みの場合はこちら
    console.log('[ App is loaded ]');
    return (
      <React.Fragment>
        <View style={styles.container}>
        {/* ↓セッション有無で振り分け */}
        {(sessionInfo.hasSession)?<Main setSessionInfo={setSessionInfo}/>:<Login setSessionInfo={setSessionInfo}/>}
        <StatusBar style="auto" />
        </View>
      </React.Fragment>
    )
  }else if(sessionInfo.status === 'before'){
    ///アプリ起動時はセッションチェックを実施
    console.log('[ App is not loaded ]');
    checkSession(sessionInfo,setSessionInfo);
    return (
      <View style={styles.container}>
        <Loading />
        <StatusBar style="auto" />
      </View>
    )
  }else if(sessionInfo.status === 'failed'){
  }
}

//Viewのスタイル
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App