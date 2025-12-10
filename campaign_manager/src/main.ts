import './style.css'

const app:HTMLElement = document.createElement('section');
app.id = 'app';
const title:HTMLElement = document.createElement('h1');
title.innerText = 'Campaign Manager';
app.appendChild(title);
document.body.appendChild(app);



