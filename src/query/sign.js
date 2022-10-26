import { useMutation, useQuery, useQueryClient } from "react-query";
import instance, { authInstance } from "../service/instance";

export const signIn = (data) => {
  return instance.post("auth/login", data);
};

export const requestSignUp = (data) => {
  return instance.post("auth/register", data);
};

export const signUp = (data) => {
  return instance.post("auth/verify", data);
};

export const requestOTP = (data) => {
  return instance.post("auth/forget-password", data);
};

export const resetPassword = (data) => {
  return instance.post("auth/reset-password", data);
};

export const validate = () => {
  return instance.get("auth/validate");
};

export const useValidate = (check) => {
  return useQuery(["user-validate", check], validate, {
    enabled: check,
    refetchOnWindowFocus: "always",
  });
};

const updateUserProfile = (data) => {
  return instance.patch("auth/update", data);
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUserProfile, {
    onSuccess: () => queryClient.invalidateQueries("user-validate"),
  });
};

const updateUserPassword = (data) => {
  return instance.post("update-password", data);
};

export const useUpdateUserPassword = () => {
  return useMutation(updateUserPassword, {});
};
