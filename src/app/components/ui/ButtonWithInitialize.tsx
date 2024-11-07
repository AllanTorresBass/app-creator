// components/ButtonWithInitialize.tsx
"use client";

import { useState } from "react";
import Button from "./button";

const ButtonWithInitialize = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialize = async () => {
    setIsLoading(true); // Activa el estado de loading
    try {
      const response = await fetch("/api/initialize");
      if (!response.ok) throw new Error("Failed to initialize");
    } catch (error) {
      console.error("Error initializing:", error);
    } finally {
      setIsLoading(false); // Desactiva el estado de loading
    }
  };

  return (
    <Button
      onClick={handleInitialize}
      variant="destructive"
      disabled={isLoading}
    >
      {isLoading ? "Initializing..." : "Initialize"}
    </Button>
  );
};

export default ButtonWithInitialize;
