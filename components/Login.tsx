import {Fragment,useState} from 'react'
// import {Alert,StyleSheet,View} from 'react-native';
import {Input,Text,Button,Dialog} from '@rneui/themed';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage'

//実装
import {getSessionName,typeSession,globalInfo,setGlobal} from './Cast';

//expoデバッグ用
import {StatusBar} from 'expo-status-bar';

//ログイン画面の引数定義
type loginViewProps = {
    setSessionInfo:React.Dispatch<React.SetStateAction<typeSession>>
}

//ログイン処理の引数定義
type loginFuncProps = {
    setSessionInfo:React.Dispatch<React.SetStateAction<typeSession>>,
    setErrMsg:React.Dispatch<React.SetStateAction<string>>,
    loginForm:{
        account:string,
        password:string
    },
    setVisible:React.Dispatch<React.SetStateAction<boolean>>
}

//ダイアログ初期化

export default function Login({setSessionInfo}:loginViewProps) {
    const [loginForm,setLoginForm] = useState({account:"",password:""});
    const [errMsg,setErrMsg] = useState("");
    const [visible,setVisible] = useState(false);
    const toggleVisible = () => {
        setVisible(!visible);
    }
    return (
    <Fragment>
      <Text h3 h3Style={{marginBottom:60}}>テストアプリ</Text>
      <Input placeholder="ID" value={loginForm.account} onChangeText={(val)=> {
        if(val !== '' && loginForm.password !== ''){ setErrMsg('') }
        setLoginForm({...loginForm,...{account:val}})
        }}/>
      <Input placeholder="Password" value={loginForm.password} onChangeText={(val)=>{
        if(val !== '' && loginForm.account !== ''){ setErrMsg('') }
        setLoginForm({...loginForm,...{password:val}})
        }} errorMessage={errMsg} secureTextEntry={true} />
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
        onPress={(ev)=>LoginComm({setSessionInfo,setErrMsg,loginForm,setVisible})}>LOGIN</Button>
        <Dialog isVisible={visible} onBackdropPress={toggleVisible}>
            <Dialog.Loading />
        </Dialog>
      <StatusBar style="auto" />
    </Fragment>
  );
}

//ログイン処理
function LoginComm({setSessionInfo,setErrMsg,loginForm,setVisible}:loginFuncProps){
    console.log(loginForm);
    if(loginForm.account === '' || loginForm.password === ''){
        setErrMsg('IDおよびPasswordを入力してください。')
    }else{
        setErrMsg('');
        setVisible(true);
        let sessionName = getSessionName();
        let query_params = new URLSearchParams(loginForm);
        let myUrl = 'https://local.rna.co.jp/test/react_login.php?' + query_params;
        fetch(myUrl,{mode:'cors'})
        .then(res => {
            console.log('HTTP CODE : ' + res.status);
            return res.json();
        }).then(content => {
            if(content.noUser){
                setErrMsg('IDまたはPasswordが間違っています。')
            }else{
                AsyncStorage.setItem(sessionName,content.testid);
                setGlobal('{"hasSession":' + content.hasSession + '}');
                setSessionInfo((prev)=>({...prev,...{hasSession:content.hasSession}}));    
            }
            console.log('Response',content);
            setVisible(false);
        }).catch(err => {
            setVisible(false);
        });
    }
}