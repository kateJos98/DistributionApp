import { useEffect, useState } from "react";
import { getCustomer } from "../services/customerService";

export function useCustomerInfo() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const data = await getCustomer();
        setCustomer(data);
      } catch (err) {
        setError("No se pudo obtener la información del cliente");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, []);

  return { customer, loading, error };
}