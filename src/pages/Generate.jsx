import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function Generate() {

  /* ---------- Dropdown Options ---------- */

  const womenTopwear = ["Top","Kurti","Crop Top","Blouse","Hoodie","T-Shirt"];
  const womenBottomwear = ["Jeans","Trousers","Palazzo","Skirt","Shorts"];

  const menTopwear = ["T-Shirt","Shirt","Hoodie","Polo","Jacket"];
  const menBottomwear = ["Jeans","Trousers","Shorts","Cargo Pants"];

  const neckOptions = ["V Neck","Crew Neck","Chinese Collar","Shirt Collar"];
  const sleeveOptions = ["Full Sleeve","Half Sleeve","Sleeveless"];
  const lengthOptions = ["Crop","Waist Length","Knee Length","Full Length"];
  const pantFit = ["Slim Fit","Regular Fit","Loose Fit"];

  const sizes = ["XS","S","M","L","XL"];
  const materials = ["Cotton","Polyester","Silk","Linen","Denim"];
  const colors = ["Black","White","Red","Blue","Green","Pink"];

  /* ---------- States ---------- */

  const [gender,setGender] = useState("Women");
  const [category,setCategory] = useState("Topwear");

  const [apparel,setApparel] = useState("");

  const [neck,setNeck] = useState(neckOptions[0]);
  const [sleeve,setSleeve] = useState(sleeveOptions[0]);
  const [length,setLength] = useState(lengthOptions[0]);
  const [fit,setFit] = useState(pantFit[0]);

  const [size,setSize] = useState("M");
  const [material,setMaterial] = useState("Cotton");
  const [color,setColor] = useState("Black");

  const [patternDescription,setPatternDescription] = useState("");
  const [additionalReq,setAdditionalReq] = useState("");

  const [promptList,setPromptList] = useState([]);

  const [images,setImages] = useState([]);
  const [progress,setProgress] = useState("");
  const [loading,setLoading] = useState(false);

  const [queue,setQueue] = useState({current:null,pending:[]});

  /* ---------- Apparel Options ---------- */

  const getApparelOptions = () => {

    if(gender === "Women"){
      return category === "Topwear"
        ? womenTopwear
        : womenBottomwear;
    }

    return category === "Topwear"
      ? menTopwear
      : menBottomwear;

  };

  /* ---------- Queue Polling ---------- */

  useEffect(()=>{

    const fetchQueue = async () => {

      try{

        const token = await auth.currentUser?.getIdToken();

        const res = await axios.get(
          "http://localhost:5000/queue",
          {headers:{Authorization:`Bearer ${token}`}}
        );

        setQueue(res.data);

      }catch(err){
        console.error(err);
      }

    };

    fetchQueue();

    const interval = setInterval(fetchQueue,2000);

    return ()=>clearInterval(interval);

  },[]);

  /* ---------- Build Prompt ---------- */

  const buildPrompt = () => {

    let prompt =
      `Professional e-commerce product photo of a ${gender}'s plain ${apparel}, ` +
      `flat lay clothing product, no human, no model, no mannequin, `;

    if(category === "Topwear"){
      prompt += `collar ${neck}, ${sleeve}, ${length}, `;
    }else{
      prompt += `${fit} fit, `;
    }

    prompt += `solid ${color} color, size ${size}, made of ${material}, `;

    if(patternDescription){
      prompt += `pattern design: ${patternDescription}, `;
    }else{
      prompt += `plain fabric, `;
    }

    if(additionalReq){
      prompt += `additional requirements: ${additionalReq}, `;
    }

    prompt +=
      `no logo, isolated product, white studio background, catalog photography, ultra realistic`;

    return prompt;

  };

  /* ---------- Add Prompt ---------- */

  const addPrompt = () => {

    const prompt = buildPrompt();

    setPromptList(prev => [...prev,prompt]);

  };

  /* ---------- Remove Prompt ---------- */

  const removePrompt = (index) => {

    setPromptList(prev => prev.filter((_,i)=>i!==index));

  };

  /* ---------- Generate Images ---------- */

  const generateImages = async () => {

    try{

      
      setImages([]);
      setProgress("Submitting prompts...");

      const token = await auth.currentUser.getIdToken();
      setPromptList([]);
      const res = await axios.post(
        "http://localhost:5000/generate",
        {prompts:promptList},
        {headers:{Authorization:`Bearer ${token}`}}
      );

      const tasks = res.data.tasks;

      let completed = 0;

      for(const task of tasks){

        const poll = setInterval(async ()=>{

          const result = await axios.get(
            `http://localhost:5000/result/${task.taskId}`,
            {headers:{Authorization:`Bearer ${token}`}}
          );

          if(result.data.status === "done"){

            setImages(prev=>[...prev,result.data.imageUrl]);

            completed++;

            setProgress(`Generated ${completed} of ${tasks.length}`);

            clearInterval(poll);

            if(completed === tasks.length){
              setLoading(false);
              setProgress("All images generated");
            }

          }

        },3000);

      }

    }catch(err){

      console.error(err);
      setLoading(false);
      alert("Generation failed");

    }

  };

  /* ---------- UI ---------- */

  return (

  <div className="generate-container">

    <h1>AI Apparel Generator</h1>

    <div className="section">
      <h3>Gender</h3>
      <select onChange={(e)=>setGender(e.target.value)}>
        <option>Women</option>
        <option>Men</option>
      </select>
    </div>

    <div className="section">
      <h3>Category</h3>
      <select onChange={(e)=>setCategory(e.target.value)}>
        <option>Topwear</option>
        <option>Bottomwear</option>
      </select>
    </div>

    <div className="section">
      <h3>Apparel</h3>
      <select onChange={(e)=>setApparel(e.target.value)}>
        {getApparelOptions().map(a=>(
          <option key={a}>{a}</option>
        ))}
      </select>
    </div>

    {category==="Topwear" && (
      <>
        <div className="section">
          <h3>Neck</h3>
          <select onChange={(e)=>setNeck(e.target.value)}>
            {neckOptions.map(n=>(
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="section">
          <h3>Sleeve</h3>
          <select onChange={(e)=>setSleeve(e.target.value)}>
            {sleeveOptions.map(s=>(
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="section">
          <h3>Length</h3>
          <select onChange={(e)=>setLength(e.target.value)}>
            {lengthOptions.map(l=>(
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </>
    )}

    {category==="Bottomwear" && (
      <div className="section">
        <h3>Fit</h3>
        <select onChange={(e)=>setFit(e.target.value)}>
          {pantFit.map(f=>(
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>
    )}

    <div className="section">
      <h3>Size</h3>
      <select onChange={(e)=>setSize(e.target.value)}>
        {sizes.map(s=>(
          <option key={s}>{s}</option>
        ))}
      </select>
    </div>

    <div className="section">
      <h3>Material</h3>
      <select onChange={(e)=>setMaterial(e.target.value)}>
        {materials.map(m=>(
          <option key={m}>{m}</option>
        ))}
      </select>
    </div>

    <div className="section">
      <h3>Color</h3>
      <select onChange={(e)=>setColor(e.target.value)}>
        {colors.map(c=>(
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>

    <div className="section">
      <h3>Pattern Description</h3>
      <textarea
        value={patternDescription}
        onChange={(e)=>setPatternDescription(e.target.value)}
      />
    </div>

    <div className="section">
      <h3>Additional Requirements</h3>
      <textarea
        value={additionalReq}
        onChange={(e)=>setAdditionalReq(e.target.value)}
      />
    </div>

    <button onClick={addPrompt}>
      Add Prompt
    </button>

    <h3>Prompt List</h3>

    {promptList.map((p,i)=>(
      <div key={i}>
        {p}
        <button onClick={()=>removePrompt(i)}>❌</button>
      </div>
    ))}

    <button
      disabled={loading}
      onClick={generateImages}
    >
      {loading ? "Generating..." : "Generate Images"}
    </button>

    <p>{progress}</p>

    <div className="image-grid">
      {images.map((img,i)=>(
        <img key={i} src={img} alt="generated"/>
      ))}
    </div>

    <h3>Queue</h3>

    {queue.current && (
      <div>🟡 Generating: {queue.current.prompt}</div>
    )}

    {queue.pending.map((q,i)=>(
      <div key={i}>⚪ Waiting: {q.prompt}</div>
    ))}
    

    <style jsx>{`
  .generate-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  .generate-container h1 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  .generate-container h3 {
    color: #555;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .section {
    margin-bottom: 1.5rem;
  }

  .section select {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    background-color: white;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }

  .section select:hover {
    border-color: #999;
  }

  .section select:focus {
    outline: none;
    border-color: #4CAF50;
  }

  .section textarea {
    width: 100%;
    min-height: 80px;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.3s ease;
  }

  .section textarea:focus {
    outline: none;
    border-color: #4CAF50;
  }

  button {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background-color: #4CAF50;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.3s ease;
  }

  button:hover:not(:disabled) {
    background-color: #45a049;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .generate-container > div {
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    border-left: 4px solid #4CAF50;
  }

  .generate-container > div button {
    width: auto;
    padding: 0.25rem 0.5rem;
    margin-left: 0.5rem;
    background-color: #f44336;
    font-size: 0.875rem;
  }

  .generate-container > div button:hover {
    background-color: #da190b;
  }

  .generate-container > p {
    text-align: center;
    font-size: 1.1rem;
    color: #666;
    margin: 1rem 0;
    font-weight: 500;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }

  .image-grid img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .image-grid img:hover {
    transform: scale(1.05);
  }
`}</style>

  </div>

  

  );

}