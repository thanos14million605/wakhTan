import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../../services/apiUser";
import useAuthStore from "../../../store/useAuthStore";
import toast from "react-hot-toast";

const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthStore();
  const {
    isPending: isUpdatingProfile,
    mutate: updateProfileMutate,
    error,
    isError,
  } = useMutation({
    mutationFn: ({ profilePic, newUsername }) =>
      updateProfile(profilePic, newUsername),

    onSuccess: () => {
      toast.success("Profile updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [`me-${authUser._id}`],
      });
    },
    onError: () => {
      toast.error("Could not update your profile. Try again!!!");
    },
  });

  return {
    isUpdatingProfile,
    updateProfileMutate,
    isError,
    error,
  };
};

export default useUpdateMe;
