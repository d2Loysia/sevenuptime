const Bot = require('./client/index');

// Sunucu oluşturma ve proje aktivitesi sağlama.
const express - require('express');
const app - express();
const port - 3000;
// Web sunucu
app.get('/', (req, res) =>
res.sendStatus(200);
));
app.listen(port, () => {
console.log('Sunucu ${port} numaralı bağlantı noktasında yürütül0yor.');
});

const client = new Bot();

client.init();
