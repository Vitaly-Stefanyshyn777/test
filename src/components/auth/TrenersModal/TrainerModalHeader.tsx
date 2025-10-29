import s from "./TrenersModal.module.css";

interface TrainerModalHeaderProps {
  onClose: () => void;
}

export default function TrainerModalHeader({
  onClose,
}: TrainerModalHeaderProps) {
  return (
    <div className={s.headerBlock}>
      <div className={s.header}>
        <h2 className={s.headerText}>Стати тренером BFB</h2>
        <button className={s.close} onClick={onClose}>
          ×
        </button>
      </div>
      <p className={s.subtitle}>
        Заповніть форму і ми зв&apos;яжемося з вами для уточнення деталей
        проходження курсу
      </p>
    </div>
  );
}
