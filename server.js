const express = require('express');
const fetch = require('node-fetch'); 
const app = express();
const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
let pc = {};

fetch(pcUrl)
    .then((res) => {
        console.log('Start get data');
        return res.json();
    })
    .then((json) => {
        pc = json;
        app.listen(3000, ()=>{
            console.log('Success! '+3000+' port run');
        });
    })
    .catch(error=>{
        console.log(error);
    })


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Orogin, X-Requested-With, Content-Type, Accept');
    next();
});

function getValueByPath(obj, path){ // obj - объект где искать , path - массива пути к свойству 
    let data=obj;
    for(let key of path){
        if(!key) break; //если пустой ключ - выходим, возвращаем результат последней итерации
        if(data.constructor()[key] !== void(0)) return void(0); //если стандартное свойство объекта - выходим
        data = data[key];
        if(data == void(0)) break; //если значения нет - выходим
    }
    return data;
}



app.get('/volumes', (req, res)=>{
    let data = {};
    pc.hdd.forEach((el) => {
        data[el.volume] = data[el.volume]?data[el.volume]+el.size:el.size;
    })
    for(let el in data){
        data[el] += 'B'
    }
    res.status(200).send(JSON.stringify(data));
});

app.get(/[\w\/-]*/, (req, res) => {
    let patch = (req.url.slice(1)).split('/');
    let result = getValueByPath(pc, patch);
    if(typeof result == "undefined") throw new Error('No data');
    else res.send(JSON.stringify(result));
});

app.use((err, req, res, next) => {   
    res.status(404).send('Not Found');
})