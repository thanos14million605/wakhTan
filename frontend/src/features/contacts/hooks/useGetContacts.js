import { useQuery } from "@tanstack/react-query";
import getContacts from "../../../services/apiContacts";

const useGetContacts = () => {
  const {
    data,
    isLoading: isFetchingContacts,
    isError,
    error,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
    staleTime: 5 * 60 * 1000,
  });

  return { contacts: data, isFetchingContacts, error, isError };
};

export default useGetContacts;
