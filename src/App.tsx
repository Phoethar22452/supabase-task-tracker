import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { TaskManager } from './TaskManager'; 
import { Auth } from './Auth'; 
import { supabase } from './SupabaseClient';

function App() {
    const [session, setSession] = useState<any>(null);

    const fetchSession = async () => {
      const {error, data} = await supabase.auth.getSession();
      if (error) {
        console.error("Fetchy Session Error:", error.message);
      }
      setSession(data.session);
    }

    useEffect(() => {
      fetchSession();
      const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }, [])

    const logout = async () => {
      await supabase.auth.signOut();
    }

    return (
      <>
        {session ? 
          <>  
            <button className="btn btn-secondary mb-3" onClick={logout}>Log Out</button>
            <TaskManager session={session}/>
          </>
          :
          <Auth />
        }
      </>
    );
}

export default App
