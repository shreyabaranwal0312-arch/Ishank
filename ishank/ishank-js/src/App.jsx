import { app, db } from "./firebase";

export default function App() {
  const firebaseReady = Boolean(app && db);

  return (
    <main className="app">
      <h1>Ishank</h1>
      <p className="app__status">
        Firebase:{" "}
        <strong>{firebaseReady ? "connected" : "not configured"}</strong>
      </p>
      <p className="app__hint">
        Project reset. Your <code>.env</code> credentials are unchanged — build
        from here.
      </p>
    </main>
  );
}
