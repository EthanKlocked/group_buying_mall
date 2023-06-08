const nameCut = (nm, len) => {
    const name = String(nm);
    return name.length > len ? `${name.substr(0, len)} ...` : name;
}
export default nameCut;