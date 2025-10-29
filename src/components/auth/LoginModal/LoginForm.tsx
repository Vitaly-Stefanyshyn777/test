import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { EmailIcon } from "@/components/Icons/Icons";
import PasswordInput from "./PasswordInput";
import s from "./LoginModal.module.css";

export interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginFormProps {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  handleSubmit: UseFormHandleSubmit<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isSubmitting: boolean;
  isPending: boolean;
  isError: boolean;
}

export default function LoginForm({
  register,
  errors,
  handleSubmit,
  onSubmit,
  isSubmitting,
  isPending,
  isError,
}: LoginFormProps) {
  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.inputGroup}>
        <div className={s.inputWrapper}>
          <div className={s.inputIcon}>
            <EmailIcon />
          </div>
          <div className={s.inputBlock}>
            <input
              className={s.input}
              placeholder="Ваш email або username"
              type="text"
              {...register("username", { required: true })}
            />
          </div>
        </div>

        <PasswordInput register={register} />
      </div>

      {(errors.username || errors.password) && (
        <p className={s.error}>Будь ласка, заповніть всі поля</p>
      )}
      {isError && <p className={s.error}>Невірний логін або пароль</p>}

      <div className={s.privacyLinkBlock}>
        <button
          className={s.submit}
          type="submit"
          disabled={isSubmitting || isPending}
        >
          {isPending ? "Вхід..." : "Увійти"}
        </button>

        <p className={s.privacyText}>
          Натискаючи на кнопку, ви погоджуєтесь з{" "}
          <a href="/privacy" className={s.privacyLink}>
            Політикою конфіденційності
          </a>
        </p>
      </div>
    </form>
  );
}
