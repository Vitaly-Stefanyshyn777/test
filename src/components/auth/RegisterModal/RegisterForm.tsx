import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import {
  EmailIcon,
  NumberIcon,
  UserIcon,
  CertificateIcon,
} from "@/components/Icons/Icons";
import RegisterPasswordInput from "./RegisterPasswordInput";
import s from "./RegisterModal.module.css";

export interface RegisterFormValues {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  certificate?: string;
}

interface RegisterFormProps {
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  handleSubmit: UseFormHandleSubmit<RegisterFormValues>;
  onSubmit: (data: RegisterFormValues) => Promise<void>;
  isSubmitting: boolean;
  isPending: boolean;
  isError: boolean;
}

export default function RegisterForm({
  register,
  errors,
  handleSubmit,
  onSubmit,
  isSubmitting,
  isPending,
  isError,
}: RegisterFormProps) {
  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.row}>
        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <div className={s.inputIcon}>
              <UserIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Ваше ім'я та прізвище"
                type="text"
                {...register("first_name", { required: true })}
              />
            </div>
          </div>
        </div>

        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <div className={s.inputIcon}>
              <NumberIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Ваш номер телефону"
                type="tel"
                {...register("phone", { required: true })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={s.row}>
        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <div className={s.inputIcon}>
              <EmailIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Ваша пошта"
                type="email"
                {...register("email", { required: true })}
              />
            </div>
          </div>
        </div>

        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <div className={s.inputIcon}>
              <CertificateIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Номер сертифіката"
                type="text"
                {...register("certificate")}
              />
            </div>
          </div>
        </div>
      </div>

      <RegisterPasswordInput register={register} />

      {(errors.first_name || errors.email || errors.phone) && (
        <p className={s.error}>
          Будь ласка, заповніть всі обов&apos;язкові поля
        </p>
      )}
      {isError && (
        <p className={s.error}>Помилка реєстрації. Спробуйте ще раз.</p>
      )}

      <div className={s.privacyLinkBlock}>
        <button
          className={s.submit}
          type="submit"
          disabled={isSubmitting || isPending}
        >
          {isPending ? "Відправка..." : "Зареєструватись"}
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
