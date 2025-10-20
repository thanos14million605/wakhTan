import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../../services/apiMessages";
import useAuthStore from "../../../store/useAuthStore";

const useGetMessages = (contactId) => {
  const { authUser } = useAuthStore();
  const {
    data,
    isLoading: isFetchingMessages,
    isError,
    error,
  } = useQuery({
    queryKey: [`messages-${contactId}`],
    queryFn: () => getMessages(contactId),

    enabled: !!contactId && !!authUser._id,
  });

  return { messages: data, isFetchingMessages, error, isError };
};

export default useGetMessages;
