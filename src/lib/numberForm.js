const numberForm = (num) => {
    let result; 
    try{
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }catch(e){
        result='error';
    }
    return result;
}
export default numberForm;