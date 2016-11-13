const express = require('express');
const config = require('./config');

//const fetch = require('node-fetch');

const app = express();
const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
const pc = {
    "board": {
        "vendor": "IBM",
        "model": "IBM-PC S-100",
        "cpu": {
            "model": "80286",
            "hz": 12000
        },
        "image": "http://www.s100computers.com/My%20System%20Pages/80286%20Board/Picture%20of%2080286%20V2%20BoardJPG.jpg",
        "video": "http://www.s100computers.com/My%20System%20Pages/80286%20Board/80286-Demo3.mp4"
    },
    "ram": {
        "vendor": "CTS",
        "volume": 1048576,
        "pins": 30
    },
    "os": "MS-DOS 1.25",
    "floppy": 0,
    "hdd": [{
        "vendor": "Samsung",
        "size": 33554432,
        "volume": "C:"
    }, {
        "vendor": "Maxtor",
        "size": 16777216,
        "volume": "D:"
    }, {
        "vendor": "Maxtor",
        "size": 8388608,
        "volume": "C:"
    }],
    "monitor": null,
    "length": 42,
    "height": 21,
    "width": 54
};


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Orogin, X-Requested-With, Content-Type, Accept');
    next();
});


function getObj(obj, pathArr){
    debugger;
    let data=obj, flagExit = false;
    pathArr.forEach((el) => {
        if(!el) {
           flagExit = true; 
        }
        else{
            if(!flagExit){
                data = data[el];
                if(!data == void(0)) flagExit = true;
            }
        }
    })
    return data;
}



app.get('/volumes', (req, res)=>{
    let data = {};
    debugger;
    console.log('Req url: ',  req.url);
    pc.hdd.forEach((el) => {
        data[el.volume] = data[el.volume]?data[el.volume]+el.size:el.size;
    })
    for(let el in data){
        data[el] += 'B'
    }
    console.log('Res volumes data: ' + data + '\n------------------------------------')
    res.status(200).send(JSON.stringify(data));
});

app.get(/[\w\/]*/, (req, res) => {
    let patch = (req.url.slice(1)).split('/');
    console.log('Req url: ',  req.url);
    debugger;
    let result = getObj(pc, patch);
    console.log('Res data: ' + result + '\n------------------------------------')
    if(result== void(0)) throw new Error('No data');
    else res.send(JSON.stringify(result));
});

app.use((err, req, res, next) => {   
    res.status(404).send('Not Found');
})




app.listen(3000, ()=>{
            console.log('Success! '+3000+' port run');
        });
/*
fetch(pcUrl)
    .then((res) => {
        return res.json();
    })
    .then((pcJson) => {
        pc = pcJson;
        app.listen(3000, ()=>{
            console.log('Success! '+config.port+' port run');
        });
    })
    .catch((error) => {
        console.log('Error!', error);
    });*/