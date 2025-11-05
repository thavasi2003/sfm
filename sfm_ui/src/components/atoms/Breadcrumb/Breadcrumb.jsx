import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
  return (
    <nav className='breadcrumb'>
      <ul>
        {items.map((item, index) => (
          <li key={index} className='breadcrumbItem'>
            {index !== items.length - 1 ? (
              <Link to={item.path} className='breadcrumbLink'>{item.label}</Link>
            ) : (
              <span className='breadcrumbCurrent'>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
