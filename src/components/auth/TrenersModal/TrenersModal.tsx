"use client";

import { useForm } from "react-hook-form";
import { useTrainerApplication } from "@/lib/useMutation";
import { useScrollLock } from "../../hooks/useScrollLock";
import TrainerModalHeader from "./TrainerModalHeader";
import TrainerForm, { type TrainerFormValues } from "./TrainerForm";
import s from "./TrenersModal.module.css";

interface TrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrenersModal({ isOpen, onClose }: TrainerModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrainerFormValues>();

  const trainerMutation = useTrainerApplication();
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const submit = async (values: TrainerFormValues) => {
    try {
      await trainerMutation.mutateAsync({
        name: values.name,
        phone: values.phone,
        email: values.email,
        instagram: values.instagram,
        comment: values.comment,
      });
      onClose();
    } catch {}
  };

  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <TrainerModalHeader onClose={onClose} />
        <TrainerForm
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          isPending={trainerMutation.isPending}
          isError={trainerMutation.isError}
        />
      </div>
    </div>
  );
}
