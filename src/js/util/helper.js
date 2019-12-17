export function makeId(length, onlyNumbers = false) {
    var result  = '';
    var characters;
    if(onlyNumbers) characters = '123456789';
    else characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length-1; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export function makeDOMId(length) {
    var result = '';
    var characters;
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length-1; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function makeDomIdUnique(id) {
    if(document.getElementById(id) !== null) {
        id = id + 1
    }
    return id;
}

export function detectIE() {
    if(navigator.userAgent.match(/Trident.*rv:11\./)) {
        return true;
    }
    else return  false;   
}

