import React from 'react';

const SuccessToast = ({ visible, message }) => {
  return (
    <div
      className={`toast ${visible ? 'show' : ''}`}
    >
      ✅ {message}
    </div>
  );
};

export default SuccessToast;
