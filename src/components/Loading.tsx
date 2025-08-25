import { useState, useEffect } from "react";
import Header from "../components/Header";
import "../styles/Loading.css"

export default function Loading() {
    const [lastUpdated, setLastUpdated] = useState("");
    
    useEffect(() => {
        updateTimestamp();
    }, []);
        
    const updateTimestamp = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        setLastUpdated(timeString);
    };
    
    const handleRefresh = () => {
        updateTimestamp();
    };
    return (
        <>
            <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
            <div className="loading-wrapper">
                <div className="loading">
                    <p className="loading-text">Загрузка</p>
                    <span className="dot"/>
                    <span className="dot"/>
                    <span className="dot"/>
                </div>
            </div>
        </>
    )
}