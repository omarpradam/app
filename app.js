const express = require('express');
var mysql = require('mysql');
const app = express();
const port = 3000;

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'almacenfrutas',
    user: 'root',
    password: '12345678'
});
connection.connect();

app.get('/frutas', (req, res) => {
    connection.query('SELECT * FROM fruta ', function (err, rows, fields) {
        if (err) res.json({ "error": err });
        res.json(rows);
    });
});

app.post('/frutas', (req, res) => {
    connection.query('INSERT INTO fruta (tipo, cantidad, precio) values ("papaya", 3, 2000)', function (err, rows, fields) {
        if (err) res.json({ "error": err });
        res.json(rows);
    });
});

app.put('/frutas', (req, res) => {
    var tipo = 'akjhsgdjka';
    var cantidad = 2;
    var precio = 11111;
    connection.query(`UPDATE fruta SET tipo = "${tipo}", cantidad = ${cantidad}, precio = ${precio} WHERE idfruta = 3`, function (err, rows, fields) {
        if (err) res.json({ "error": err });
        res.json(rows);
    });
});

app.delete('/frutas', (req, res) => {
    connection.query(`DELETE FROM fruta WHERE idfruta = 4 `, function (err, rows, fields) {
        if (err) res.json({ "error": err });
        res.json(rows);
    });
});

app.post('/pedido', (req, res) => {
    var body = {
        "frutas": [
            {
                "idFruta": 1,
                "cantidad": 6,
                "precio": 8000
            },
            {
                "idFruta": 2,
                "cantidad": 3,
                "precio": 2000
            }
        ]
    };
    var precioTotal = 0;
    var cantidadTotalFrutas = 0;
    body.frutas.forEach(fruta => {
        precioTotal += fruta.precio * fruta.cantidad;
        cantidadTotalFrutas += fruta.cantidad;
    });
    if (cantidadTotalFrutas >= 5) {
        precioTotal = precioTotal - (precioTotal * 0.10);
    }


    connection.query(`INSERT INTO pedidos (precio) values (${precioTotal})`, function (err, rows, fields) {
        if (err) return res.json({ "error": err });
        var insertId = rows.insertId;
        console.log(insertId);
        body.frutas.forEach(fruta => {
            connection.query(`INSERT INTO frupedi (idpedido, idfruta, cantidad) values (${insertId}, ${fruta.idFruta}, ${fruta.cantidad})`, function (err, rows, fields) {
                if (err) console.log(err);
            });
        });
    });
    res.json({ mensaje: "OK" });
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});