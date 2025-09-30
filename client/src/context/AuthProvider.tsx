import { fetchData } from "@/lib/rapidApi";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext =createContext();

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState("new");

  useEffect(() => {
    fetchAlldata(value);
  }, [value]);

  const fetchAlldata = (query) => {
    setLoading(true);
    fetchData(`search/?q=$(query)`).then((contents) => {
      setData(contents);
      setLoading(false);
    });
  };
  return (
    <AuthContext.Provider value={{ loading, setValue, data, value }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
