"use client";
import Container from "@/components/ui/Container/Container";
import UpperDescription from "@/components/ui/UpperDescription/UpperDescription";
import s from "./CalculateSection.module.css";
import { Formik, Form, Field } from "formik";
// import { useState } from "react";
export default function CalculateSection() {
  return (
    <section className={s.section}>
      <Container>
        <div className={s.topBlock}>
          <UpperDescription>Калькулятор дохідності</UpperDescription>
          <h2>Розрахуйте окупність вашого проєкту BFB</h2>
        </div>
        <div className={s.content}>
          <div className={s.calculatorContainer}>
            <h3>
              Дізнайтесь, коли повернете вкладення — заповніть кілька полів.
            </h3>
            <Formik
              onSubmit={(v) => {
                console.log(v);
              }}
              initialValues={{
                rent: "",
                averagePrice: "",
                desiredAmountOfBoards: "",
                lessonsPerWeek: "",
              }}
            >
              <Form className={s.form}>
                <div className={s.fields}>
                  <Field
                    as="input"
                    type={"number"}
                    name="rent"
                    placeholder="Ціна оренди за годину"
                  />
                  <Field
                    as="input"
                    type={"number"}
                    name="desiredAmountOfBoards"
                    placeholder="Бажана кількість бордів"
                  />
                  <Field
                    as="input"
                    type={"number"}
                    name="averagePrice"
                    placeholder="Середня вартість тренування для клієнта"
                  />
                  <Field
                    as="input"
                    type={"number"}
                    name="lessonsPerWeek"
                    placeholder="Кількість тренувань на тиждень"
                  />
                </div>
                <button type="submit">Розрахувати окупність</button>
              </Form>
            </Formik>
          </div>
          <div className={s.statistics}>
            <h3>Загальний дохід</h3>
            <ul>
              <li>
                <h4>Загальні вкладення</h4>
                <p>36 000 ₴ </p>
              </li>
              <li>
                <h4>Витрати на тиждень</h4>
                <p>36 000 ₴ </p>
              </li>
              <li>
                <h4>Дохід за місяць</h4>
                <p>36 000 ₴ </p>
              </li>
            </ul>
            <div>
              <h4>Дохід за тиждень</h4>
              <p>10 200 ₴ </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
