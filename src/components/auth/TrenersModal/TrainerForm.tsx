import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import {
  EmailIcon,
  InstagramIcon,
  NumberIcon,
  QuestionIcon,
  UserIcon,
} from "@/components/Icons/Icons";
import s from "./TrenersModal.module.css";

export interface TrainerFormValues {
  name: string;
  phone: string;
  email: string;
  instagram: string;
  comment?: string;
}

interface TrainerFormProps {
  register: UseFormRegister<TrainerFormValues>;
  errors: FieldErrors<TrainerFormValues>;
  handleSubmit: UseFormHandleSubmit<TrainerFormValues>;
  onSubmit: (data: TrainerFormValues) => Promise<void>;
  isSubmitting: boolean;
  isPending: boolean;
  isError: boolean;
}

export default function TrainerForm({
  register,
  errors,
  handleSubmit,
  onSubmit,
  isSubmitting,
  isPending,
  isError,
}: TrainerFormProps) {
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
                {...register("name", { required: true })}
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
              <InstagramIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Нікнейм Instagram"
                type="text"
                {...register("instagram", { required: true })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={s.rowSingle}>
        <div className={s.inputWrapper}>
          <div className={s.inputIconWrapper}>
            <QuestionIcon />
          </div>
          <textarea
            className={`${s.input} ${s.textarea}`}
            placeholder="Коментар (необов'язково)"
            rows={4}
            {...register("comment")}
          />
        </div>
      </div>

      {(errors.name || errors.phone || errors.email || errors.instagram) && (
        <p className={s.error}>
          Будь ласка, заповніть всі обов&apos;язкові поля
        </p>
      )}
      {isError && (
        <p className={s.error}>Помилка відправки заявки. Спробуйте ще раз.</p>
      )}

      <div className={s.privacyLinkBlock}>
        <button
          className={s.submit}
          type="submit"
          disabled={isSubmitting || isPending}
        >
          {isPending ? "Відправка..." : "Залишити заявку"}
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
