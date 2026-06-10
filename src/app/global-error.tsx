"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="uk">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            background: "#0D0D0D",
            color: "#F0F0F0",
          }}
        >
          <h1 style={{ margin: 0 }}>Щось пішло не так / Something went wrong</h1>
          <p style={{ margin: 0, color: "#A0A0A0" }}>
            Сталася критична помилка. Спробуйте ще раз.
            <br />
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "0.5rem",
              padding: "0.6rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              background: "#CC0000",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Спробувати знову / Try again
          </button>
        </div>
      </body>
    </html>
  );
}
