import React, { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({ children, text, position }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => {
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  return (
    <div className="tooltip-container" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {visible && (
        <div className={`tooltip-box tooltip-${position}`}>
          {text}
          <span className={`tooltip-arrow tooltip-arrow-${position}`}></span>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
