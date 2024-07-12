import React, { createContext, useState } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <AlertContext.Provider value={{ alertMessage, setAlertMessage }}>
      {children}
      {alertMessage && <div className="alert">{alertMessage}</div>}
    </AlertContext.Provider>
  );
};
