import axiosInstance from "./axiosInstance";

const getContacts = async () => {
  const res = await axiosInstance.get("/api/v1/messages/contacts");
  return res.data.data.contacts;
};

export default getContacts;
