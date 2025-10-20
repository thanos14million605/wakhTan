import axiosInstance from "./axiosInstance";

const getMessages = async (contactId) => {
  const res = await axiosInstance.get(`/api/v1/messages/${contactId}`);
  return res.data.data.messages;
};

const sendMessage = async (text, image, contactId) => {
  const res = await axiosInstance.post(`/api/v1/messages/${contactId}`, {
    text,
    image,
  });
  return res;
};

const deleteMessage = async (messageId, contactId) => {
  const res = await axiosInstance.delete(
    `/api/v1/messages/${contactId}/${messageId}`
  );
  return res;
};

export { getMessages, sendMessage, deleteMessage };
