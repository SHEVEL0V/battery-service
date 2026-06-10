"use client";

import { useActionState, useState } from "react";
import { Box, Container, Paper, Step, StepLabel, Stepper } from "@mui/material";
import type { Dictionary } from "@/dictionaries";
import { createBooking, type BookingState } from "./actions";
import { BookingStepCar } from "./BookingStepCar";
import { BookingStepDate } from "./BookingStepDate";
import { BookingStepContact } from "./BookingStepContact";
import { BookingSuccess } from "./BookingSuccess";
import type { BookingDraft, BookingStep } from "./types";

const initialState: BookingState = {};

interface Props {
  dict: Dictionary["booking"];
  errorsDict: Dictionary["errors"];
}

export function BookingForm({ dict, errorsDict }: Props) {
  const [step, setStep] = useState<BookingStep>(1);
  const [draft, setDraft] = useState<BookingDraft>({});
  const [state, action, isPending] = useActionState(createBooking, initialState);

  const steps = [dict.step1, dict.step2, dict.step3];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          {!state.success && (
            <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {state.success ? (
            <BookingSuccess dict={dict} />
          ) : step === 1 ? (
            <BookingStepCar
              dict={dict}
              errorsDict={errorsDict}
              defaultValues={draft}
              onNext={(data) => {
                setDraft((prev) => ({ ...prev, ...data }));
                setStep(2);
              }}
            />
          ) : step === 2 ? (
            <BookingStepDate
              dict={dict}
              errorsDict={errorsDict}
              defaultValues={draft}
              onNext={(data) => {
                setDraft((prev) => ({ ...prev, ...data }));
                setStep(3);
              }}
              onPrev={() => setStep(1)}
            />
          ) : (
            <form action={action}>
              <input type="hidden" name="carModel" value={draft.carModel ?? ""} />
              <input type="hidden" name="year" value={draft.year ?? ""} />
              <input type="hidden" name="date" value={draft.date ?? ""} />
              <BookingStepContact
                dict={dict}
                state={state}
                isPending={isPending}
                onPrev={() => setStep(2)}
              />
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
