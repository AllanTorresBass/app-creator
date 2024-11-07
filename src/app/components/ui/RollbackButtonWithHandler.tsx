// components/RollbackButtonWithHandler.tsx
"use client";

import { useState } from "react";
import Button from "./button";

const RollbackButtonWithHandler = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRollback = async () => {
    setIsLoading(true); // Activa el estado de loading
    try {
      const response = await fetch("/api/initialize/delete");
      if (!response.ok) {
        throw new Error("Failed to rollback");
      }
      // Manejar la respuesta si es necesario
    } catch (error) {
      console.error("Error rolling back:", error);
    } finally {
      setIsLoading(false); // Desactiva el estado de loading
    }
  };

  return (
    <Button onClick={handleRollback} variant="destructive" disabled={isLoading}>
      {isLoading ? "Rolling back..." : "Rollback"}
    </Button>
  );
};

export default RollbackButtonWithHandler;
