import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Main from './component/main.js';
import Logo from './component/logo.js';
import Loading from './component/loading.js';
import Download from './component/download.js';
import './App.css';
import Guideline from './component/guideline.js';
import Footer from './component/footer.js';
function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Logo />
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/loading" element={<Loading />} />
					<Route path="/download" element={<Download />} />
					<Route path="/guideline" element={<Guideline />} />
				</Routes>
				<Footer />
			</div>
		</BrowserRouter>
		
	);
}

export default App;
