import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "../../../services/apiMessages";

const useDeleteMessage = (contactId) => {
  const queryClient = useQueryClient();

  const {
    // data: messages, Not neccessary
    mutate: deleteMessageMutate,
    isError,
    error,
    isPending: isDeletingMessage,
  } = useMutation({
    mutationFn: ({ messageId, contactId }) =>
      deleteMessage(messageId, contactId),

    onMutate: async ({ messageId, contactId }) => {
      await queryClient.cancelQueries({
        queryKey: [`messages-${contactId}`],
      });

      const prevMessages = queryClient.getQueryData([`messages-${contactId}`]);

      queryClient.setQueryData([`messages-${contactId}`], (old) => {
        return old.filter((message) => message._id !== messageId);
      });

      return { prevMessages };
    },

    onError: (_err, _varibales, context) => {
      if (context?.prevMessages) {
        queryClient.setQueryData(
          [`messages-${contactId}`],
          context.prevMessages
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`messages-${contactId}`],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
      });
    },
  });

  return { isDeletingMessage, deleteMessageMutate, isError, error };
};

export default useDeleteMessage;
