import RingMark from "./RingMark";
import "./DataState.css";

export function Loading({ label = "Loading…" }) {
  return (
    <div className="data-state">
      <RingMark size={40} className="data-state__spin" />
      <p>{label}</p>
    </div>
  );
}

export function SetupNotice() {
  return (
    <div className="data-state data-state--wide">
      <RingMark size={44} />
      <h3>The dashboard isn't connected yet</h3>
      <p>
        This site reads its data from Supabase, and the connection details
        haven't been set up in this environment. Copy <code>.env.example</code>{" "}
        to <code>.env.local</code>, fill in your Supabase project URL and anon
        key, then restart the dev server. See the README for the full setup
        steps.
      </p>
    </div>
  );
}

export function ErrorNotice({ message }) {
  return (
    <div className="data-state">
      <RingMark size={40} />
      <p>{message || "Something went wrong loading this. Please try again."}</p>
    </div>
  );
}

export function DataGate({ loading, error, children, label }) {
  if (loading) return <Loading label={label} />;
  if (error) {
    if (error.message === "not-configured") return <SetupNotice />;
    return <ErrorNotice message={error.message} />;
  }
  return children;
}
