import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { metricsApi } from "@/api/api";

export const useStartups = () => {
  const queryClient = useQueryClient();

  const startupsQuery = useQuery({
    queryKey: ["startups"],
    queryFn: metricsApi.getAll,
    select: (res) => Array.isArray(res.data) ? res.data : [res.data],
  });

  const addStartupMutation = useMutation({
    mutationFn: metricsApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["startups"] });
    },
  });

  return { startupsQuery, addStartupMutation };
};
