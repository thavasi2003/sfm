import React from 'react';
import './Drawer.css';

const Drawer = ({ open, direction, size, children }) => {
  const getPositionStyle = () => {
    switch (direction) {
      case 'fromLeft':
        return { left: 0, width: size };
      case 'fromTop':
        return { top: 0, height: size };
      case 'fromRight':
        return { right: 0, width: size, top: 0, height: '100%' };
      case 'fromBottom':
        return { bottom: 0, height: size };
      default:
        return { left: 0, width: size };
    }
  };

  const getAnimationClass = () => {
    if (open) {
      return `drawer-open-${direction}`;
    } else {
      return `drawer-close-${direction}`;
    }
  };

  return (
    <div className={`drawer ${getAnimationClass()}`} style={getPositionStyle()}>
        {children}
    </div>
  );
};

export default Drawer;
