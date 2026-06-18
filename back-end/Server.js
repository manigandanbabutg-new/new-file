require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", async (req,res)=>{

    try{

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
            {
                method:"POST",
                headers:{
                    Authorization:
                    `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    inputs:req.body.prompt
                })
            }
        );

        const result =
        await response.json();

        res.json({
            output: result[0]?.generated_text
                     || JSON.stringify(result)
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

app.listen(3000,()=>{
    console.log("Server Running");
});
