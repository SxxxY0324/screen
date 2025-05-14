import React from 'react';
import titleImage from '../assets/images/title.jpg';
import '../styles/Header.css';

function Header() {
  return (
    <div className="dashboard-header">
      <img src={titleImage} alt="经纬裁剪房看板" className="title-image" />
    </div>
  );
}

export default Header; 