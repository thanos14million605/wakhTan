import { useQuery } from "@tanstack/react-query";

import useAuthStore from "../../../store/useAuthStore";
import { getMe } from "../../../services/apiUser";

const useGetMe = () => {
  const { authUser } = useAuthStore();
  const {
    data,
    isPending: isGettingMe,
    isError,
    error,
  } = useQuery({
    queryKey: [`me-${authUser?._id}`],
    queryFn: getMe,
  });

  return { me: data, isGettingMe, isError, error };
};

export default useGetMe;
