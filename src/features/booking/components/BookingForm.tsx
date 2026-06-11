"use client";

import { useActionState, useRef, useState } from "react";
import { Box, Container, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/i18n/config";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { SectionBackgroundImage } from "@/components/ui/SectionBackgroundImage";
import { adaptiveOverlaySx, adaptiveOverlayVarsSx } from "@/lib/styles/sectionBackground";
import { createBooking, type BookingState } from "../actions";
import { BookingStepCar } from "./BookingStepCar";
import { BookingStepDate } from "./BookingStepDate";
import { BookingStepContact } from "./BookingStepContact";
import { BookingSuccess } from "./BookingSuccess";
import type { BookingDraft, BookingStep } from "../types";

const initialState: BookingState = {};

const stepVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -40 }),
};

interface Props {
  dict: Dictionary["booking"];
  errorsDict: Dictionary["errors"];
}

export function BookingForm({ dict, errorsDict }: Props) {
  const [step, setStep] = useState<BookingStep>(1);
  const [draft, setDraft] = useState<BookingDraft>({});
  const [state, action, isPending] = useActionState(createBooking, initialState);
  const prefersReducedMotion = useReducedMotion();
  const direction = useRef(1);

  const goTo = (next: BookingStep) => {
    direction.current = next > step ? 1 : -1;
    setStep(next);
  };

  const steps = [dict.step1, dict.step2, dict.step3];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, ...adaptiveOverlayVarsSx }}>
      <SectionBackgroundImage src="/images/booking.jpg" overlaySx={adaptiveOverlaySx} />

      <Container maxWidth="sm" sx={{ position: "relative" }}>
        <ScrollReveal>
          <Paper sx={{ p: { xs: 3, md: 5 }, overflow: "hidden" }}>
            {!state.success && (
              <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            <AnimatePresence mode="wait" custom={direction.current} initial={false}>
              <motion.div
                key={state.success ? "success" : step}
                custom={direction.current}
                variants={prefersReducedMotion ? undefined : stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {state.success ? (
                  <BookingSuccess dict={dict} />
                ) : step === 1 ? (
                  <BookingStepCar
                    dict={dict}
                    errorsDict={errorsDict}
                    defaultValues={draft}
                    onNext={(data) => {
                      setDraft((prev) => ({ ...prev, ...data }));
                      goTo(2);
                    }}
                  />
                ) : step === 2 ? (
                  <BookingStepDate
                    dict={dict}
                    errorsDict={errorsDict}
                    defaultValues={draft}
                    onNext={(data) => {
                      setDraft((prev) => ({ ...prev, ...data }));
                      goTo(3);
                    }}
                    onPrev={() => goTo(1)}
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
                      onPrev={() => goTo(2)}
                    />
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </Paper>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
