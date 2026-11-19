import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Field, SInput, SubmitButton } from "shared/ui";
import { ILoginFormInputs } from "shared/types";
import { useNotification, useAuth } from "app";

import styles from "./FormLogin.module.css";

const formSchema = yup.object().shape({
  email: yup.string().required("You must specify an email"),
  password: yup.string().required("You must specify a password"),
});

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginFormInputs>({
    resolver: yupResolver(formSchema),
  });

  const notify = useNotification();
  const { login } = useAuth();

  const submit: SubmitHandler<ILoginFormInputs> = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.error(error);

      let message = "Could not log in";

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        message = error.message;
      }

      notify.showWarning(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Field label="Email" error={errors.email}>
        <SInput
          type="email"
          id="email"
          autoComplete="username"
          autoFocus
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email")}
        ></SInput>
      </Field>
      <Field label="Password" error={errors.password}>
        <SInput
          type="password"
          id="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? "true" : "false"}
          {...register("password")}
        ></SInput>
      </Field>
      <div className={styles.submitRow}>
        <SubmitButton isLoading={isSubmitting}>Login</SubmitButton>
      </div>
    </form>
  );
};

export { LoginForm };
