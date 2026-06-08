const Lib_Source=new function(){
this.cs = function sha256Sync(message) {
 
    function strToUtf8Bytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (code < 0x80) bytes.push(code);
            else if (code < 0x800) {
                bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
            } else if (code < 0xd800 || code >= 0xe000) {
                bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            } else {
                i++;
                code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            }
        }
        return bytes;
    }

    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    
 
    const bytes = strToUtf8Bytes(message);
    const words = [];
    for (let i = 0; i < bytes.length; i++) {
        words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
    }

 
    const bitLength = bytes.length * 8;
    words[bitLength >> 5] |= 0x80 << (24 - (bitLength % 32));
    words[(((bitLength + 64) >> 9) << 4) + 15] = bitLength;

 
    const S = (X, n) => (X >>> n) | (X << (32 - n));
    const ch = (x, y, z) => (x & y) ^ (~x & z);
    const maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
    const sigma0 = (x) => S(x, 2) ^ S(x, 13) ^ S(x, 22);
    const sigma1 = (x) => S(x, 6) ^ S(x, 11) ^ S(x, 25);
    const gamma0 = (x) => S(x, 7) ^ S(x, 18) ^ (x >>> 3);
    const gamma1 = (x) => S(x, 17) ^ S(x, 19) ^ (x >>> 10);

 
    const W = new Array(64);
    for (let i = 0; i < words.length; i += 16) {
        let [a, b, c, d, e, f, g, h] = H;

        for (let j = 0; j < 64; j++) {
            if (j < 16) {
                W[j] = words[i + j] || 0;
            } else {
                W[j] = (gamma1(W[j - 2]) + W[j - 7] + gamma0(W[j - 15]) + W[j - 16]) | 0;
            }

            const T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0;
            const T2 = (sigma0(a) + maj(a, b, c)) | 0;

            h = g; g = f; f = e; e = (d + T1) | 0;
            d = c; c = b; b = a; a = (T1 + T2) | 0;
        }

        H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }

	//Return
    return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
};
this.hash = function sha256Sync(message) {
 
    function strToUtf8Bytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (code < 0x80) bytes.push(code);
            else if (code < 0x800) {
                bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
            } else if (code < 0xd800 || code >= 0xe000) {
                bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            } else {
                i++;
                code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            }
        }
        return bytes;
    }

    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    
 
    const bytes = strToUtf8Bytes(message);
    const words = [];
    for (let i = 0; i < bytes.length; i++) {
        words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
    }

 
    const bitLength = bytes.length * 8;
    words[bitLength >> 5] |= 0x80 << (24 - (bitLength % 32));
    words[(((bitLength + 64) >> 9) << 4) + 15] = bitLength;

 
    const S = (X, n) => (X >>> n) | (X << (32 - n));
    const ch = (x, y, z) => (x & y) ^ (~x & z);
    const maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
    const sigma0 = (x) => S(x, 2) ^ S(x, 13) ^ S(x, 22);
    const sigma1 = (x) => S(x, 6) ^ S(x, 11) ^ S(x, 25);
    const gamma0 = (x) => S(x, 7) ^ S(x, 18) ^ (x >>> 3);
    const gamma1 = (x) => S(x, 17) ^ S(x, 19) ^ (x >>> 10);

 
    const W = new Array(64);
    for (let i = 0; i < words.length; i += 16) {
        let [a, b, c, d, e, f, g, h] = H;

        for (let j = 0; j < 64; j++) {
            if (j < 16) {
                W[j] = words[i + j] || 0;
            } else {
                W[j] = (gamma1(W[j - 2]) + W[j - 7] + gamma0(W[j - 15]) + W[j - 16]) | 0;
            }

            const T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0;
            const T2 = (sigma0(a) + maj(a, b, c)) | 0;

            h = g; g = f; f = e; e = (d + T1) | 0;
            d = c; c = b; b = a; a = (T1 + T2) | 0;
        }

        H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }

	//Return
    return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
};
this.encode = function(ops,is_descrypt=false){
const CHACHA_CONSTANTS = [
    0x61707865, 0x33322d64, 0x79622d65, 0x74656b20
];

const mTable = String.fromCharCode(...Array.from({length: 128}, (v, k) => k));

const U32 = {
    to32: (val) => val >>> 0,
    add: (a, b) => (a + b) >>> 0,
    xor: (a, b) => (a ^ b) >>> 0,
    rotl: (val, shift) => (val << shift) | (val >>> (32 - shift)),
};
const String_fromCharCode=(...bytes)=>{
	let result = "";
    for (let i = 0; i < bytes.length; i++) {
         result += mTable[bytes[i]]; 
    }
    return result;
}
const strToBytes = (str) => {
    let bytes = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code < 0x80) { 
            bytes.push(code);
        } else if (code < 0x800) { 
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0xD800 || code >= 0xE000) { // 2048-65535 (trừ surrogate pairs)
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else { 
            i++;
            code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            bytes.push(
                0xf0 | (code >> 18),
                0x80 | ((code >> 12) & 0x3f),
                0x80 | ((code >> 6) & 0x3f),
                0x80 | (code & 0x3f)
            );
        }
    }
    return bytes;
};

const bytesToStr = (bytes) => {
    return String_fromCharCode(...bytes);
};

const b64 = {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: (str) => {
        let output = "";
        for (let i = 0; i < str.length; i += 3) {
            let c1 = str.charCodeAt(i), c2 = str.charCodeAt(i + 1), c3 = str.charCodeAt(i + 2);
            output += b64.chars.charAt(c1 >> 2);
            output += b64.chars.charAt(((c1 & 3) << 4) | (c2 >> 4));
            output += (i + 1 < str.length) ? b64.chars.charAt(((c2 & 15) << 2) | (c3 >> 6)) : "=";
            output += (i + 2 < str.length) ? b64.chars.charAt(c3 & 63) : "=";
        }
        return output;
    },
    decode: (str) => {
        let output = "";
        str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        for (let i = 0; i < str.length; i += 4) {
            let e1 = b64.chars.indexOf(str.charAt(i)), e2 = b64.chars.indexOf(str.charAt(i+1)),
                e3 = b64.chars.indexOf(str.charAt(i+2)), e4 = b64.chars.indexOf(str.charAt(i+3));
            output += String_fromCharCode((e1 << 2) | (e2 >> 4));
            if (e3 !== 64) output += String_fromCharCode(((e2 & 15) << 4) | (e3 >> 2));
            if (e4 !== 64) output += String_fromCharCode(((e3 & 3) << 6) | e4);
        }
        return output;
    },
	encodeFromBytes: (bytes) => {
        let output = "";
        for (let i = 0; i < bytes.length; i += 3) {
            let c1 = bytes[i], c2 = bytes[i + 1], c3 = bytes[i + 2];
            output += b64.chars.charAt(c1 >> 2);
            output += b64.chars.charAt(((c1 & 3) << 4) | (c2 >> 4));
            output += (i + 1 < bytes.length) ? b64.chars.charAt(((c2 & 15) << 2) | (c3 >> 6)) : "=";
            output += (i + 2 < bytes.length) ? b64.chars.charAt(c3 & 63) : "=";
        }
        return output;
    },
    decodeToBytes: (str) => {
        let bytes = [];
        str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        for (let i = 0; i < str.length; i += 4) {
            let e1 = b64.chars.indexOf(str.charAt(i)), 
                e2 = b64.chars.indexOf(str.charAt(i + 1)),
                e3 = b64.chars.indexOf(str.charAt(i + 2)), 
                e4 = b64.chars.indexOf(str.charAt(i + 3));

            bytes.push((e1 << 2) | (e2 >> 4));
            if (e3 !== 64) bytes.push(((e2 & 15) << 4) | (e3 >> 2));
            if (e4 !== 64) bytes.push(((e3 & 3) << 6) | e4);
        }
        return bytes;
    },	
};


const utf8 = {
    encode: (str) => {
        let bytes = [];
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (code < 0x80) bytes.push(code);
            else if (code < 0x800) bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
            else if (code < 0xd800 || code >= 0xe000) bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            else {
                i++;
                code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            }
        }
        return bytes;
    },
    decode: (bytes) => {
        let str = "", i = 0;
        while (i < bytes.length) {
            let b1 = bytes[i++];
            if (b1 < 0x80) str += String_fromCharCode(b1);
            else if (b1 < 0xe0) str += String_fromCharCode(((b1 & 0x1f) << 6) | (bytes[i++] & 0x3f));
            else if (b1 < 0xf0) str += String_fromCharCode(((b1 & 0x0f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f));
            else {
                let code = ((b1 & 0x07) << 18) | ((bytes[i++] & 0x3f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
                code -= 0x10000;
                str += String_fromCharCode(0xd800 | (code >> 10), 0xdc00 | (code & 0x3ff));
            }
        }
        return str;
    }
};
const bytesToU32 = (bytes) => {
    let words = [];
    for (let i = 0; i < bytes.length; i += 4) {
        words.push(
            (bytes[i] |
             (bytes[i + 1] << 8) |
             (bytes[i + 2] << 16) |
             (bytes[i + 3] << 24)) >>> 0 
        );
    }
    return words;
};
const U32ToBytes = (words) => {
    let bytes = [];
    for (let i = 0; i < words.length; i++) {
        bytes.push(
            words[i] & 0xff,
            (words[i] >>> 8) & 0xff,
            (words[i] >>> 16) & 0xff,
            (words[i] >>> 24) & 0xff
        );
    }
    return bytes;
};
const padBytes = (bytes, len) => {
    let padded = [...bytes];
    while (padded.length < len) {
        padded.push(0);
    }
    return padded;
};
function QR(state, a, b, c, d) {
    state[a] = U32.add(state[a], state[b]); state[d] = U32.xor(state[d], state[a]); state[d] = U32.rotl(state[d], 16);
    state[c] = U32.add(state[c], state[d]); state[b] = U32.xor(state[b], state[c]); state[b] = U32.rotl(state[b], 12);
    state[a] = U32.add(state[a], state[b]); state[d] = U32.xor(state[d], state[a]); state[d] = U32.rotl(state[d], 8);
    state[c] = U32.add(state[c], state[d]); state[b] = U32.xor(state[b], state[c]); state[b] = U32.rotl(state[b], 7);
};
const hexToBytes = (hex) => {
    let bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes; // Trả về mảng 32 số
};
function chacha20_block(keyWords, nonceWords, counterWord) {
    let state = [
        ...CHACHA_CONSTANTS,
        ...keyWords,
        counterWord,
        ...nonceWords
    ];
    let workingState = [...state];
    for (let i = 0; i < 10; i++) {
        QR(workingState, 0, 4, 8, 12);
        QR(workingState, 1, 5, 9, 13);
        QR(workingState, 2, 6, 10, 14);
        QR(workingState, 3, 7, 11, 15);

        QR(workingState, 0, 5, 10, 15);
        QR(workingState, 1, 6, 11, 12);
        QR(workingState, 2, 7, 8, 13);
        QR(workingState, 3, 4, 9, 14);
    }
    let finalState = [];
    for (let i = 0; i < 16; i++) {
        finalState.push(U32.add(state[i], workingState[i]));
    }
    return finalState;
}
const generateRandomNonce = () => {
    let nonce = "";
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 12; i++) {
        nonce += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return nonce;
};


function chacha20_crypt_raw(keyBytes, nonceBytes, dataBytes) {
    const keyWords = bytesToU32(padBytes(keyBytes, 32));
    const nonceWords = bytesToU32(padBytes(nonceBytes, 12));
    
    let resultBytes = [];
    let counter = 0;

    for (let i = 0; i < dataBytes.length; i += 64) {
        const block = chacha20_block(keyWords, nonceWords, counter++);
        const keystream = U32ToBytes(block);

        for (let j = 0; j < 64 && (i + j) < dataBytes.length; j++) {
            resultBytes.push(dataBytes[i + j] ^ keystream[j]);
        }
    }
    return resultBytes;
}

function secureEncrypt(plaintext, keySha256Hex) {
    const keyBytes = hexToBytes(keySha256Hex);
    const nonceBytes = utf8.encode(generateRandomNonce()).slice(0, 12);
    const dataBytes = utf8.encode(plaintext);
    const encryptedBytes = chacha20_crypt_raw(keyBytes, nonceBytes, dataBytes);
    const finalPackage = [...nonceBytes, ...encryptedBytes];
    return b64.encodeFromBytes(finalPackage); 
}
function secureDecrypt(base64Data, keySha256Hex) {
    const keyBytes = hexToBytes(keySha256Hex);
    const combinedBytes = b64.decodeToBytes(base64Data);
    const nonceBytes = combinedBytes.slice(0, 12);
    const encryptedBytes = combinedBytes.slice(12);
    const decryptedBytes = chacha20_crypt_raw(keyBytes, nonceBytes, encryptedBytes);
    return utf8.decode(decryptedBytes);
}
	
	
const do_now=function(){
	ops=Object.assign({
		text:null,
		key:null,
	},ops);
	const rawKey = bytesToStr(hexToBytes(ops.key));
	if(is_descrypt){
		return secureDecrypt(ops.text,rawKey);
	}
	return secureEncrypt(ops.text,rawKey)
	console.log(ops);
}
return do_now();

};
this.checksum = function(str){
		let a = 1, b = 0;
		for (let i = 0; i < str.length; i++) {
			a = (a + str.charCodeAt(i)) % 65521;
			b = (b + a) % 65521;
		}
		return (b << 16) | a;
	};
this.sec = function() {
    let ok=true;
	let div_frame=null;
	let frame=new function(){
		this.init=function(){
			const iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			document.body.appendChild(iframe);
			div_frame=iframe;
		}
		this.close=function(){
			document.body.removeChild(div_frame);
		}
	};
	
	let mime=new function(){
		this.eval=function(){
			let ok=true;
			const cleanEval = div_frame.contentWindow.eval;
			if(eval !== cleanEval)return false;
			
			const evalString=cleanEval.toString().replace(/\s+/g, ' ');
			ok=evalString === "function eval() { [native code] }";
			return ok;
		}
		this.isf=function(){
			let ok=true;
			const str = Function.prototype.toString.call(Function);
			if(str !== "function Function() { [native code] }")return false;
			const cleanFunction = div_frame.contentWindow.Function;
			if(Function !== cleanFunction)return false;
			const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Function');
			if (!descriptor) return false;
			return descriptor.writable === true && 
           descriptor.enumerable === false && 
           descriptor.configurable === true;
		}
	}
	frame.init();
	for(let i in mime){
		ok=mime[i]();
		if(!ok)break;
	}
	frame.close();
	return ok;
};

};
const Lib_Ziper = function(dds,...__mx){ 
	let ddx=Object.assign({},{
		step:null,
		keys:null,
	},dds);
	if(ddx.step && !Array.isArray(ddx.step))return null;
	if(ddx.keys){
		 if(!Array.isArray(ddx.keys))return null;
		if(ddx.keys.length<10)return null;
	}
	let t=this;
	let _t=null;
	let se={};
	let conf={
		max:null,
		ok:true,
		do:"env,zip",
		try:"hash,encode,checksum,sec",
		cs:"source,exe",
		step:{},
		on:{},
	};
	let ops={};
	let e={};
	e.key=function(...m){return m.filter(x=>x).join("_");}
	conf.mini=function(s){ //return s;
		return s;
	};
	conf.er=function(...m){
		//console.log("Error Complide",...m);
		return false;
	};
	conf.eval=function(__s){
		if(!__s){conf.ok=false;return null;}
		let __c=eval(["(function(){ return ",__s,";}());"].join(""));
		if(!__c){conf.ok=false;return null};
		return __c;
	};
	conf.s_ify=async function(){
		let ii={rt:null};
		await new Promise((done)=>{
			try{ ii.rt=JSON.stringify(s);done();}
			catch(er){	done(conf.er(er.toString()));}
		});
		return ii.rt;
	};
	conf.worker=async function(...m){ 
			let rt=null;
			try{
			const runner = new Function('...m', `
				return (async () => {
				const internalA = new Function('return ' + m.shift())();
				const internalB = new Function('return ' + m.shift())();
				return await internalA(internalB, ...m);
				})();
			`);
			rt=await runner(...m);
			}catch(er){
				//console.log("Input",...m);console.log("ERFUNC",er);
			};
		return rt;
	};
	conf.jdone=async function(s){
		let ii={rt:null};
		await new Promise((done)=>{
			try{ ii.rt=JSON.parse(s);done()}
			catch(er){done(conf.er(er.toString()));}
		});
		if(!ii.rt)return null;
		return await conf.worker(
			ii.rt.exe,
			ii.rt.source,...__mx);
	};
	conf.next=new function(){
		let d={count:0,key:null};
		let last=null;
		let first=null;
		
		let _get=function(){
			return conf.on.checksum(JSON.stringify(Object.assign({},d,{
				mem:conf.on.checksum("Counter:"+d.count),
				})));
		}
		let _go=function(){
			d.count++;
			d.key=_get();
		}
		this.init=function(){
			first=d.key=conf.on.hash(JSON.stringify(ops));
		}
		this.go=function(num){
			for(let i=0;i<num;i++)_go();
			last=_get();
			return last;
		}
		this.reset=function(){
			d.count=0;
			d.key=last;
		}
		this.signal=function(c,si){
			let rt=null;
			rt=conf.on.checksum(JSON.stringify({
				key:first,
				node:conf.on.hash(JSON.stringify(c)),
				}));
			if(si)return rt===si;
			return rt;
		}
		
	};
	conf.key=new function(){
		let tn=this;
		let d=[];
		this.add=function(s){
			d.push(s);
		}
		this.export=function(){
			return d;
		}
		this.is_max=function(c){
			if(!conf.max)return true;
			return c<=conf.max;
		}
		this.find=function(s){
			let c=0;
			let si=null;
			let ok=false;
			while(!ok && tn.is_max(++c)){
				si=conf.next.go(1);
				if(si===s)ok=true;
				}
			if(ok)return c;
			return null;
		}
		
	};

	
	e.m=[conf.do,conf.try].filter(x=>x).join(",").split(',');
	for(let i of e.m)if(t[i] && typeof t[i]=='function'){
			ops[i]=conf.mini(t[i].toString());
			se[i]=t[i];
			}
	e.m=conf.try.split(",");
	for(let i of e.m){
			if(t[i] && typeof t[i]=='function')
				conf.on[i]=conf.eval(conf.mini(t[i].toString()));
			else{
				conf.ok=false;
				break;
			}
		}
	if(!conf.ok)return conf.er();
	ops.is_safe=conf.on.sec();
	e.rt={};
	e.signal=[];
	if(ops["env"])_t=se.env();
	if(ddx.keys){
		e.m=conf.cs.split(',');
		for(let i of e.m){
			e.name=e.key("cs",i);
			ops[e.name]=ddx.keys.shift();
		}
	}
	if(ddx.step){
		e.m=conf.cs.split(',');
		for(let i of e.m){
			if(ddx[i]){
				e.ss=ddx[i];
				if(typeof e.ss=='function')e.ss=e.ss.toString();
				e.name=e.key("cs",i);
				e.s=ops[e.name]=se.checksum(e.ss);
				e.signal.push(e.s);
			}
		}
	}
	if(ddx.step){
		conf.next.init();
		for(let i of ddx.step){
				conf.key.add(conf.next.go(i));
				conf.next.reset();
				}
		e.d={};
		e.m=conf.cs.split(',');
		for(let i of e.m){
			e.d[i]=(typeof ddx[i]=='function')?
					ddx[i].toString():ddx[i];
		}
		
		e.rt.installer=conf.on.encode({
			text:JSON.stringify(e.d),
			key:conf.next.signal(ddx.step),
		});
		e.keys=conf.key.export();
		e.signal.push(conf.next.signal(e.keys));
		e.rt.keys=[...e.signal,...e.keys];
		return e.rt;
	}
	if(ddx.keys && ddx.installer){
		conf.next.init();
		e.s=ddx.keys.shift();
		if(!conf.next.signal(ddx.keys,e.s))return false;
		e.m=[];
		e.ok=true;
		for(let i of ddx.keys){
			e.ii=conf.key.find(i);
			if(!e.ii){
				e.ok=false;
				break;
			}
			e.m.push(e.ii);
			conf.next.reset();
		}
		if(!e.ok)return conf.er();
		e.s=conf.on.encode({
			text:ddx.installer,
			key:conf.next.signal(e.m),
			},true);
		if(!e.s)return conf.er();
		return conf.jdone(e.s);
	}
	return conf.er();
};

// YOU CAN CUSTOME FROM HERE;
const Lib_Excute = new function(){
	Lib_Source.zip=Lib_Ziper;
	let _do=Lib_Source.zip.bind(Lib_Source);
	this.lib=Lib_Source;
	this.exe=function(...m){
			return _do(...m);
		 };
};
export default Lib_Excute;