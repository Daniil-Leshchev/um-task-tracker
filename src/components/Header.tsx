import "../styles/Header.css";
import React from 'react';

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
                <h1>Система отслеживания выполнения задач кураторами</h1>
            </div>
            <button className="image-icon">
                <img src="/images/icon.svg"  alt="Иконка личного кабинета"/>
            </button>
        </div>
        </header>
    );
};

export default Header;
