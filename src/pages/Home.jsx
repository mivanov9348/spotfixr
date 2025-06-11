import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container">
            <div className="hero">
                <h1 className="hero-title">Welcome to SpotFixr</h1>
                <p className="hero-subtitle">
                    Help us improve your city by reporting issues like potholes, broken benches, or damaged streetlights.
                </p>
                <Link to="/submit">
                    <button className="hero-button">Report An Issue</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
