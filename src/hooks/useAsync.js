import { useEffect, useState, useRef } from "react";
import { isSupabaseConfigured } from "../lib/supabase";

// Re-runs `fn` whenever `deps` change, tracking loading/error/data state.
// Guards against setting state after unmount / after a newer call resolved.
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const callId = useRef(0);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState({ data: null, loading: false, error: new Error("not-configured") });
      return;
    }
    const id = ++callId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => {
        if (id === callId.current) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (id === callId.current) setState({ data: null, loading: false, error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
