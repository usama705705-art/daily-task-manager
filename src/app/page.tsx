export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(17, 24, 39, 0.08)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
            borderRadius: "18px",
            background: "var(--primary)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          DT
        </div>

        <h1
          style={{
            fontSize: "clamp(30px, 6vw, 48px)",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Daily Task Manager
        </h1>

        <p
          style={{
            color: "var(--muted)",
            fontSize: "16px",
            lineHeight: 1.7,
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          A professional task management platform for administrators,
          groups, users, and progress tracking.
        </p>
      </section>
    </main>
  );
}
