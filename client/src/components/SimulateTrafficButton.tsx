import { useState } from "react";
import styles from "./SimulateTrafficButton.module.css";

interface SimulateTrafficButtonProps {
  onClick: () => Promise<void>;
}

export default function SimulateTrafficButton({
  onClick,
}: SimulateTrafficButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      disabled={isLoading}
    >
      <span className={styles.dot} />
      {isLoading ? "Sending event..." : "Simulate traffic"}
    </button>
  );
}
