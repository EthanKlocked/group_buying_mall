const stripslashes = (str)  => {
    try {
        if (str === null || str === undefined) return;
        str = str.replace(/\\'/g, "'");
        str = str.replace(/\\"/g, '"');
    } catch (e) {}
    return str;
}

export default stripslashes;