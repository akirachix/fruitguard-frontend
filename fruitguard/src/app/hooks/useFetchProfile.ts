import { useEffect, useState } from "react";
import { fetchProfile } from "../utils/fetchProfile";
import { Profile } from "../utils/types";

export default function useProfile(token: string) {
  const [profile, setProfile] = useState<Profile |null >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token is missing");
      setLoading(false);
      return;
    }

    const fetchData=async () =>{
      setLoading(true);
      setError(null);

      try{
        const data=await fetchProfile(token);
        if (!data){
          throw new Error("Failed to load profile");
        }
        setProfile(data);
      }
      catch(error){
        setError((error as Error).message|| "Failed to load profile");
      }
      finally{
        setLoading(false);
      }
    };
   fetchData(); 
  },[token]);


  return { profile, loading, error };
}


  

     

