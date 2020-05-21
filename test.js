let first = "";
let last = "";
let hash = "";
function hexString(buffer) {
    // creates an array of 8-bit unsigned integers
    const byteArray = new Uint8Array(buffer);
    // turns that hash into hex
    const hexCodes = [...byteArray].map(value => {
        // eash element in array is converted to base 16 string
        const hexCode = value.toString(16);
        // pad beggining with 0  why?
        const paddedHexCode = hexCode.padStart(2, '0');
        // return upper case hex hash
        return paddedHexCode.toUpperCase();
    });
    // return a string not an array
    return hexCodes.join('');
}

function digestMessage(message) {
    // Returns a newly constructed TextEncoder that will generate a byte stream with utf-8 encoding.
    const encoder = new TextEncoder();
    // Takes a USVString as input, and returns a Uint8Array containing utf-8 encoded text.
    const data = encoder.encode(message);
    // returns the hash
    //The digest() method of the SubtleCrypto interface generates a digest of the given data. 
    // A digest is a short fixed-length value derived from some variable-length input.
    return window.crypto.subtle.digest('SHA-1', data);
}

async function runCheck(text) {
    /* let outPut = document.getElementById("outPut");
    let inPut = document.getElementById("inPut");
    let text = inPut.value; */
    if (text === "") return false;
    digestMessage(text).then(digestValue => {
        hash = hexString(digestValue);
        first = hash.substring(0, 5);
        last = hash.substring(5);
        fetch('https://api.pwnedpasswords.com/range/' + first)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    return response.text();
                })
            .then(function (text) {
                return text.split("\r\n");
            })
            .then(function (arr) {

                document.getElementById("outPut")
                    .innerHTML = "The password : " + text +
                    "SHA1 Hash : " + hash +
                    "<br>Was not found!";

                arr.forEach((s) => {

                    let a = s.split(":");

                    if (a[0] == last) {

                        /* document.getElementById("outPut")
                            .innerHTML = "The password : " + text +
                            "SHA1 Hash : " + hash +
                            "Was found " + a[1] + "</b> times!"; */
                            console.log("The password : " + text +
                            "<br>SHA1 Hash : " + hash +
                            "</span><br>Was found " + a[1] + " times!")
                        return true;

                    }

                });

            })
            .catch(function (error) {
                log('Request failed', error)
            });

    });

    outPut.value = "";

}

runCheck('test');