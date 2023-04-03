import Template from "../template/template"
import React, { useState } from "react";
import './profil.css'


const CircleImage = () => {
    const [imageUrl, setImageUrl] = useState<string>("https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg");
    
    const containerStyle = {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      overflow: "hidden",
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          const selectedImage = event.target.files[0];
          const imageUrl = URL.createObjectURL(selectedImage);
          setImageUrl(imageUrl);
        }
      };

      
      return (
          <div style={containerStyle}>
        <img className="circle-image" src={imageUrl} alt="avatar" />
        <input type="file" accept=".jpg,.png,.jpeg" onChange={handleImageChange}
            style={{ display: "none" }}
            
            />
            

      </div>
    );
};


const Profil = () => {
    var myImageUrl:string ="https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg";
    var name:string ="Pigi16";

    const handleButtonClick = () => {
      document.getElementById("file-input")?.click();
    };
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file && file.length > 0) {
      setSelectedFile(file[0]);
    }
    return selectedFile;
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image';
    input.click();
  };

    return (
        <Template>
            <div>
                <CircleImage/>
                <br />
                <button onClick={handleClick}>Changer d'image</button>
            </div>
            <div>
                <h3>
                    Nom : {name}
                </h3>
            </div>
        </Template>
    );
  }

  export default Profil