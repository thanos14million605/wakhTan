import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "./../../../services/apiMessages";
import useAuthStore from "../../../store/useAuthStore";

const useSendMessage = (contactId) => {
  const { authUser } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    mutate: sendMessageMutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: [`messages-${contactId}`],
    mutationFn: ({ text, image, contactId }) =>
      sendMessage(text, image, contactId),

    // TODO tomorrow: To make the chat snappy, I will have to implement
    // optimistic update here
    onMutate: async ({ text, image }) => {
      await queryClient.cancelQueries({
        queryKey: [`messages-${contactId}`],
      });

      const previousData = queryClient.getQueryData({
        queryKey: [`messages-${contactId}`],
      });

      queryClient.setQueryData([`messages-${contactId}`], (oldData = []) => {
        return [
          ...oldData,
          {
            text,
            senderId: authUser?._id,
            receiverId: contactId,
            image,
            temp: true,
            _id: Date.now(),
          },
        ];
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [`messages-${contactId}`],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`messages-${contactId}`],
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return {
    isSendingMessage: isPending,
    isError,
    error,

    sendMessageMutate,
  };
};

export default useSendMessage;
