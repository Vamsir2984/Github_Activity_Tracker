#!/usr/bin/env node
const https = require('https');
const express = require("express");
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const generateUrl = (user) => {
   
    const url = `https://api.github.com/users/${user}/events`; 
    return url;
}

const token = process.env.token;

const options = {
    headers: {
        'User-Agent': 'node.js',
        'Authorization': `token ${token}`
    }
};


const [,, user] = process.argv;


const url = generateUrl(user);

https.get(url, options, (res) => {
    const { statusCode } = res; 
    let error;
    const contentType = res.headers['content-type'];

    if (statusCode !== 200) {
        error = new Error(`The status code is: ${statusCode}`);
    } else if (!contentType || !contentType.includes('application/json')) {
        error = new Error(`The content type is: ${contentType}`);
    }

    if (error) {
        console.error(`Error: ${error.message}`);
        res.resume();
        return;
    }

    res.setEncoding('utf8');

    let rawData = "";
    res.on("data", (chunk) => {
        rawData += chunk;
    });

    res.on("end", () => {
        try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
        } catch (error) {
            console.error(`Error parsing JSON: ${error.message}`);
        }
    });

}).on('error', (e) => {
    console.error(`Request error: ${e.message}`);
});
