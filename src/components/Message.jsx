import React from 'react';

export default function Message({ message }) {
  if (!message) return null;
  return (
    <div className={`global-alert-toast banner-${message.type}`}>
      <p>{message.text}</p>
    </div>
  );
}
