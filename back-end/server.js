require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* Home Route */
app.get("/", (req, res) => {
    res.send("Backend Running Successfully 🚀");
});

/* Test Route */
app.get("/generate", (req, res) => {
    res.send("Generate Endpoint Ready");
});

/* AI Route */
app.post("/generate", async (req, res) => {

    try {

        if (!req.body.prompt) {
            return res.status(400).json({
                error: "Prompt is required"
            });
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/zai-org/GLM-5.2",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: req.body.prompt
                })
            }
        );

        const result = await response.json();

        res.json({
            output:
                result[0]?.generated_text ||
                JSON.stringify(result)
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

/* Render Port */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
