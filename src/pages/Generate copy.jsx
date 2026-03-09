import { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function Generate() {

  const [gender, setGender] = useState("Women");
  const [category, setCategory] = useState("Topwear");

  const womenTopwear = ["Top", "Kurti", "Crop Top", "Blouse", "Hoodie", "T-Shirt"];
  const womenBottomwear = ["Jeans", "Trousers", "Palazzo", "Skirt", "Shorts"];

  const menTopwear = ["T-Shirt", "Shirt", "Hoodie", "Polo", "Jacket"];
  const menBottomwear = ["Jeans", "Trousers", "Shorts", "Cargo Pants"];

  const neckOptions = ["V Neck", "Crew Neck", "Chinese Collar", "Shirt Collar"];
  const sleeveOptions = ["Full Sleeve", "Half Sleeve", "Sleeveless"];
  const lengthOptions = ["Crop", "Waist Length", "Knee Length", "Full Length"];
  const pantFit = ["Slim Fit", "Regular Fit", "Loose Fit"];

  const sizes = ["XS", "S", "M", "L", "XL"];
  const materials = ["Cotton", "Polyester", "Silk", "Linen", "Denim"];
  const colors = ["Black", "White", "Red", "Blue", "Green", "Pink"];

  const [apparel, setApparel] = useState("");
  const [neck, setNeck] = useState(neckOptions[0]);
  const [sleeve, setSleeve] = useState(sleeveOptions[0]);
  const [length, setLength] = useState(lengthOptions[0]);
  const [fit, setFit] = useState(pantFit[0]);
  const [size, setSize] = useState("M");
  const [material, setMaterial] = useState("Cotton");
  const [color, setColor] = useState("Black");

  // NEW FIELDS
  const [patternDescription, setPatternDescription] = useState("");
  const [additionalReq, setAdditionalReq] = useState("");

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const getApparelOptions = () => {
    if (gender === "Women") {
      return category === "Topwear" ? womenTopwear : womenBottomwear;
    } else {
      return category === "Topwear" ? menTopwear : menBottomwear;
    }
  };

  const generateImage = async () => {

    setLoading(true);

    const token = await auth.currentUser.getIdToken();

    let prompt =
      `Professional e-commerce product photo of a ${gender}'s plain ${apparel} only, ` +
      `flat lay clothing product, no human, no model, no mannequin, no body parts, `;

    if (category === "Topwear") {
      prompt += `collar ${neck}, ${sleeve}, ${length}, `;
    } else {
      prompt += `${fit} fit, `;
    }

    prompt += `solid ${color} color, size ${size}, made of ${material}, `;

    if (patternDescription) {
      prompt += `pattern design: ${patternDescription}, `;
    } else {
      prompt += `plain fabric, `;
    }

    if (additionalReq) {
      prompt += `additional requirements: ${additionalReq}, `;
    }

    prompt +=
      `no logo, no print, isolated product, ` +
      `white studio background, catalog photography, ultra realistic, high detail`;

    const res = await axios.post(
      "http://localhost:5000/generate",
      { prompt },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setImage(res.data.imageUrl);
    setLoading(false);
  };

  return (
    <div className="generate-container">

      <h1 className="main-heading">
        AI Apparel Generator
      </h1>

      <div className="section">
        <h3>Gender</h3>
        <select onChange={(e) => setGender(e.target.value)}>
          <option>Women</option>
          <option>Men</option>
        </select>
      </div>

      <div className="section">
        <h3>Category</h3>
        <select onChange={(e) => setCategory(e.target.value)}>
          <option>Topwear</option>
          <option>Bottomwear</option>
        </select>
      </div>

      <div className="section">
        <h3>Apparel Type</h3>
        <select onChange={(e) => setApparel(e.target.value)}>
          {getApparelOptions().map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>


      {category === "Topwear" && (
        <>
          <div className="section">
            <h3>Neck Type</h3>
            <select onChange={(e) => setNeck(e.target.value)}>
              {neckOptions.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="section">
            <h3>Sleeve Type</h3>
            <select onChange={(e) => setSleeve(e.target.value)}>
              {sleeveOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="section">
            <h3>Length</h3>
            <select onChange={(e) => setLength(e.target.value)}>
              {lengthOptions.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </>
      )}


      {category === "Bottomwear" && (
        <div className="section">
          <h3>Fit Type</h3>
          <select onChange={(e) => setFit(e.target.value)}>
            {pantFit.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      )}


      <div className="section">
        <h3>Size</h3>
        <select onChange={(e) => setSize(e.target.value)}>
          {sizes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>


      <div className="section">
        <h3>Material</h3>
        <select onChange={(e) => setMaterial(e.target.value)}>
          {materials.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>


      <div className="section">
        <h3>Color</h3>
        <select onChange={(e) => setColor(e.target.value)}>
          {colors.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>


      {/* Pattern Description */}

      <div className="section">
        <h3>Describe Pattern</h3>
        <textarea
          placeholder="Example: Floral pattern, stripes, geometric design..."
          value={patternDescription}
          onChange={(e) => setPatternDescription(e.target.value)}
          rows={3}
        />
      </div>


      {/* Additional Requirements */}

      <div className="section">
        <h3>Additional Requirements</h3>
        <textarea
          placeholder="Example: Premium look, soft texture, summer friendly..."
          value={additionalReq}
          onChange={(e) => setAdditionalReq(e.target.value)}
          rows={3}
        />
      </div>


      <button
        className="generate-btn"
        onClick={generateImage}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>


      {image && (
        <div className="preview">
          <img src={image} alt="Generated Apparel" />
        </div>
      )}


      <style>{`

.generate-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  font-family: Arial;
}

.main-heading {
  text-align:center;
  margin-bottom:30px;
  font-size:28px;
  font-weight:bold;
}

.section{
 margin-bottom:18px;
}

.section h3{
 margin-bottom:6px;
 font-size:14px;
 color:#555;
}

select,textarea{
 width:100%;
 padding:10px;
 border-radius:6px;
 border:1px solid #ccc;
 font-size:14px;
 transition:.3s;
}

select:focus,textarea:focus{
 outline:none;
 border-color:#4f46e5;
 box-shadow:0 0 5px rgba(79,70,229,.4);
}

.generate-btn{
 width:100%;
 padding:12px;
 margin-top:15px;
 background:#4f46e5;
 color:white;
 font-size:16px;
 font-weight:bold;
 border:none;
 border-radius:8px;
 cursor:pointer;
}

.generate-btn:hover{
 background:#4338ca;
}

.preview{
 margin-top:25px;
 text-align:center;
}

.preview img{
 max-width:100%;
 border-radius:10px;
 box-shadow:0 5px 20px rgba(0,0,0,0.15);
}

      `}</style>

    </div>
  );
}