import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios";



function App() {
  const [msg, setMsg] = useState(0)

    const fetchApi = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api");
            console.log(response.data.message);
            setMsg(response.data.message);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchApi();
    }, []);

  return (
    <>
        <h1>
            {msg}
        </h1>
    </>
  )
}

export default App
