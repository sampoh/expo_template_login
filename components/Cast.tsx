//セッションデータ名
export const sessionName:string = "Sampoh-Id";
export function getSessionName(MODE:string = '',headerId:string = ''):string{
    if(MODE.toLowerCase() === 'json'){
        return '{"' + sessionName + '":"' + headerId + '"}'; //fetchコマンドのheader用JSONを返却
    }else{
        return sessionName; //名称文字列のみを返却
    }
}

//ユーザデータの型 ( DOM同期させたい値 )
export type typeSession = {
    status:string;
    loaded:boolean;
    hasSession:boolean;
};

//グローバル値の型 ( DOM同期させたくない値 )
export type typeGlobalInfo = {
    loaded:boolean,
    hasSession:boolean,
    sessionId:string,
    userId:string,
    limit:string,
    iodate:string
}

//グローバル値の初期値 ( DOM同期させたくない値 )
export let globalInfo:typeGlobalInfo = {
    loaded:false,
    hasSession:false,
    sessionId:"",
    userId:"",
    limit:"",
    iodate:""
};

//グローバル値の更新 ( 引数はJSON文字列なので注意 )
export function setGlobal(JS:string){
    globalInfo = {...globalInfo,...JSON.parse(JS)};
};