import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function Gallery() {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const fetchDesigns = async () => {
      const token = await auth.currentUser.getIdToken();

      const res = await axios.get(
        "http://localhost:5000/my-designs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDesigns(res.data);
    };

    fetchDesigns();
  }, []);

  return (
    <div>
      <h2>My Designs</h2>
      <div className="image-grid">
        {designs.map((d, i) => (
          <div className="card" key={i}>
            <img src={d.imageUrl} />
            <p>{d.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
