import React, { useState, useEffect, useCallback } from "react";
import CounterDisplay from "../components/CounterDisplay";

export default function WaterTracker() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("waterCount");
    return saved !== null ? Number(saved) : 0;
  });
  const [goal, setGoal] = useState(() => {
    const savedGoal = localStorage.getItem("waterGoal");
    return savedGoal !== null ? Math.max(1, Number(savedGoal)) : 8;
  });

  const [goalInput, setGoalInput] = useState(goal);
  const [tip, setTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);
  const [tipError, setTipError] = useState("");

  const increase = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrease = useCallback(() => {
    setCount(prev => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  useEffect(() => {
    localStorage.setItem("waterCount", String(count));
  }, [count]);

  const saveGoal = () => {
    const g = Math.max(1, Number(goalInput));
    setGoal(g);
    setGoalInput(g);
    localStorage.setItem("waterGoal", String(g));
  };

  useEffect(() => {
    let ignore = false;

    const fetchTip = async () => {
        setLoadingTip(true);
        setTipError("");

        try {
            const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch tip");
            const data = await res.json();
            const advice = data?.slip?.advice;

            if (!ignore) setTip(advice || "Stay hydrated and take breaks!");
        } catch (e) {
            if (!ignore) setTipError("Could not load health tip. Try again.");
        } finally {
            if (!ignore) setLoadingTip(false);
        }
    };

        fetchTip();

        return () => {
            ignore = true;
        };
    }, []);

  return (
    <div>
      <h2>Water Tracker</h2>

      <CounterDisplay count={count} goal={goal} />

      <div style={{ marginTop: 12 }}>
        <input
          type="number"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
        />
        <button onClick={saveGoal}>Save Goal</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={increase}>+</button>
        <button onClick={decrease}>-</button>
        <button onClick={reset}>Reset</button>
      </div>

      {count >= goal && <p>Goal Reached 🎉</p>}

      <div style={{ marginTop: 16 }}>
        <h4>Today’s Health Tip:</h4>

        {loadingTip && <p>Loading tip...</p>}
        {tipError && <p style={{ color: "red" }}>{tipError}</p>}
        {!loadingTip && !tipError && <p>{tip}</p>}
       </div>
    </div>
  );
}