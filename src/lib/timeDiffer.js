const timeDiffer = (from, to) => {
    const lag = to.getTime()-from.getTime();
    const day = lag / (1000*60*60*24);
    const hour = lag / (1000*60*60);
    const min = lag / (1000*60);
    const sec = lag / (1000);

    const result = 
        day >= 1 ? `${Math.ceil(day)}일 전` : 
        hour >=1 ? `${Math.ceil(hour)}시간 전` : 
        min >= 1 ? `${Math.ceil(min)}분 전` : 
        sec >= 1 ? `${Math.ceil(sec)}초 전` : null;
        
    return result;
}
export default timeDiffer;