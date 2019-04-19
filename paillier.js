// import paillier
const paillier = require('paillier-js')

// // create random keys
// const {
//     publicKey,
//     privateKey
// } = paillier.generateRandomKeys(2048);

// // optionally, you can create your public/private keys from known parameters
// // const publicKey = new paillier.PublicKey(n, g);
// // const privateKey = new paillier.PrivateKey(lambda, mu, p, q, publicKey);

// // encrypt m
// let c = publicKey.encrypt(m);

// // decrypt c
// let d = privateKey.decrypt(c);

// // homomorphic addition of two chipertexts (encrypted numbers)
// let c1 = publicKey.encrypt(m1);
// let c2 = publicKey.encrypt(m2);
// let encryptedSum = publicKey.addition(c1, c2);
// let sum = privateKey.decrypt(encryptedSum); // m1 + m2

// // multiplication by k
// // let c1 = publicKey.encrypt(m1);
// // let encryptedMul = publicKey.multiply(c1, k);
// // let mul = privateKey.decrypt(encryptedMul); // k · m1

const bigInt = require('big-integer');

const {
    publicKey,
    privateKey
} = paillier.generateRandomKeys(32); // Change to at least 2048 bits in production state

console.log('Modulus n has', publicKey.bitLength, 'bits');

console.log('\n\nTesting additive homomorphism\n');

let num1 = 5;
let num2 = 2;
let num3 = -3;
let bn1 = bigInt(num1).mod(publicKey.n);
while (bn1.lt(0)) bn1 = bn1.add(publicKey.n); // The sign of the remainder will match the sign of the dividend and we don't want negative numbers
let bn2 = bigInt(num2).mod(publicKey.n);
while (bn2.lt(0)) bn2 = bn2.add(publicKey.n); // The sign of the remainder will match the sign of the dividend and we don't want negative numbers
let bn3 = bigInt(num3).mod(publicKey.n);
while (bn3.lt(0)) bn3 = bn3.add(publicKey.n); // The sign of the remainder will match the sign of the dividend and we don't want negative numbers

let c1 = publicKey.encrypt(bn1);
let c2 = publicKey.encrypt(bn2);
let c3 = publicKey.encrypt(bn3);

console.log('num1:', num1.toString());
console.log('c1:', c1.toString(16), '\n');

console.log('num2:', num2.toString());
console.log('c2:', c2.toString(16), '\n');

console.log('num3:', num3.toString());
console.log('c3:', c3.toString(16), '\n');

let encryptedSum = publicKey.addition(c1, c2, c3);
console.log('E(num1 + num2 + num3):', encryptedSum.toString(16), '\n');

let sum = bn1.add(bn2).add(bn3).mod(publicKey.n);
let decryptedSum = privateKey.decrypt(encryptedSum);
console.log('Decrypted addition:', decryptedSum.toString());
console.log(`Expecting ${num1} + ${num2} + ${num3} mod n :`, sum.toString());
console.assert(sum.compare(decryptedSum) == 0, 'Something went wrong!');

console.log('\n\nTesting multiplication\n');

let encryptedMul = publicKey.multiply(c1, bn2);
console.log(`E(${num1})^${num2} mod n^2 = E(${num2}·${num1} mod n) = ` + encryptedMul.toString(16), '\n');

let mul = bn1.multiply(bn2).mod(publicKey.n);
let decryptedMul = privateKey.decrypt(encryptedMul);
console.log('Decryption:', decryptedMul.toString());
console.log(`Expecting ${num2}·${num1} mod n :`, mul.toString());
console.assert(mul.compare(decryptedMul) == 0, 'Something went wrong!');