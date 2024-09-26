import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Main from './component/main.js';
import Logo from './component/logo.js';
import Loading from './component/loading.js';
import Download from './component/download.js';
import './App.css';

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Logo />
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/loading" element={<Loading />} />
					<Route path="/download" element={<Download />} />
				</Routes>
			</div>
		</BrowserRouter>
		
	);
}

export default App;
