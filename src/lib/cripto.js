import CryptoJs from 'crypto-js';

const cripto = (task=null, secretKey=null, iv=null, text=null) => { //AES256
    if(!task || !secretKey || !iv || !text) return 'lack';

    try{
        
        if(task == "en"){
            const cipher = CryptoJs.AES.encrypt(text, CryptoJs.enc.Utf8.parse(secretKey), {
                iv: CryptoJs.enc.Utf8.parse(iv),
                padding: CryptoJs.pad.Pkcs7,
                mode: CryptoJs.mode.CBC,
            });
            return cipher.toString();
        }else if(task == "de"){
            const decipher = CryptoJs.AES.decrypt(text, CryptoJs.enc.Utf8.parse(secretKey), {
                iv: CryptoJs.enc.Utf8.parse(iv),
                padding: CryptoJs.pad.Pkcs7,
                mode: CryptoJs.mode.CBC,
            });
            return decipher.toString(CryptoJs.enc.Utf8);
        } 
    }catch(e){
        console.log(e);
    }
}
export default cripto;