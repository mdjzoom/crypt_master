const NodeRSA = require('node-rsa');
const paillier = require('paillier-js');
const express = require('express')
const app = express()
const port = 3000

app.get('/rsa/:key/:text', (req, res) => {
    const key = new NodeRSA({
        b: req.params.key
    });
    const text = req.params.text;
    const encrypted = key.encrypt(text, 'base64');
    const decrypted = key.decrypt(encrypted, 'utf8');
    res.send(`Text:${decrypted} || Encryption:${encrypted}`);
})

app.get('/paillier/:key/:text', (req, res) => {

    // import paillier

    // create random keys
    const {
        publicKey,
        privateKey
    } = paillier.generateRandomKeys(req.params.key);

    // encrypt m
    let c = publicKey.encrypt(req.params.text);

    // decrypt c
    let d = privateKey.decrypt(c);
    res.send(`Text:${d} || Encryption:${c}`);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))