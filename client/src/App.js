// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Main from './component/main.js';
import Logo from './component/logo.js';
import Loading from './component/loading.js';
import './App.css';

function App() {
	return (
		<div className="App">
			<Logo />
       		<Main />
        	<Loading />
		</div>
	);
}

export default App;
