const strToDate = (str)  => {
    let y = str.substring(0, 4) || null;
    let m = Number(str.substring(5, 7))-1 || null;
    let d = str.substring(8, 10) || null;
    let h = str.substring(11, 13) || null;
    let min = str.substring(14, 16) || null;
    let sec = str.substring(17, 19) || null;

    return new Date(y,m,d,h,min,sec);
}

export default strToDate;