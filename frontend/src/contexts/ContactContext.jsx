import React, { createContext, useMemo, useState } from "react";

const ContactsContext = createContext();

const ContactsProvider = ({ children }) => {
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [selectedContactUserName, setSelectedContactUserName] = useState(null);

  const handleSelectedContact = (id) => {
    setSelectedContactId(id);
  };

  const handleSelectedContactUserName = (uName) => {
    setSelectedContactUserName(uName);
  };

  const value = useMemo(
    () => ({
      selectedContactId,
      onSelectContact: handleSelectedContact,
      selectedContactUserName,
      onSelectContactUserName: handleSelectedContactUserName,
    }),
    [selectedContactId, selectedContactUserName]
  );

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

export { ContactsContext, ContactsProvider };
