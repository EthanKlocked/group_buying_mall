const priceForm = (num, onlyNumber=false) => {
    let result; 
    try{
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }catch(e){
        result='error';
    }
    return result + (onlyNumber?'':'원');
}
export default priceForm;