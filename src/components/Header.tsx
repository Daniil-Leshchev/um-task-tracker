import "../styles/Header.css";
import React from 'react';
import { Link } from "react-router-dom";

interface HeaderProps {
  onRefresh?: () => void;
  lastUpdated: string;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, lastUpdated }) => {
    return (
        <header className="header">
        <div className="header-content">
            <img src="/images/logo.svg"  alt="Логотип" className="image-logo"/>
            <div className="header-title">
                <h1>Умная система мониторинга задач</h1>
            </div>
            <Link to='/profile'>
            <button className="image-icon">
                <img src="/images/icon.svg"  alt="Иконка личного кабинета"/>
            </button>
            </Link>
            <button className="image-notification">
                <img src="/images/notification.svg"  alt="Иконка уведомлений"/>
            </button>
        </div>
        </header>
    );
};

export default Header;
