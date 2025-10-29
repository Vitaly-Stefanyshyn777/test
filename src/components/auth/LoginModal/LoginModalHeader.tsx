import s from "./LoginModal.module.css";

interface LoginModalHeaderProps {
  onClose: () => void;
}

export default function LoginModalHeader({ onClose }: LoginModalHeaderProps) {
  return (
    <div className={s.headerBlock}>
      <div className={s.header}>
        <h2>Вхід до кабінету</h2>
        <button className={s.close} onClick={onClose}>
          ×
        </button>
      </div>
      <p className={s.subtitle}>
        Авторизуйтесь, щоб отримати доступ до особистого кабінету
      </p>
    </div>
  );
}
