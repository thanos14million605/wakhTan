import React, { useContext } from "react";
import { ContactsContext } from "../contexts/ContactContext";

const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error("Attempting to consume context above provider.");
  }

  return context;
};

export default useContacts;
