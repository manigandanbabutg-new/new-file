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

```
try {

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({
            error: "Prompt is required"
        });
    }

    const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "zai-org/GLM-5.2:novita",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 500
            })
        }
    );

    const result = await response.json();

    console.log("HF Response:", result);

    if (!response.ok) {
        return res.status(response.status).json(result);
    }

    res.json({
        output: result.choices[0].message.content
    });

} catch (error) {

    console.error("Server Error:", error);

    res.status(500).json({
        error: error.message
    });
}
```

});

/* Server Start */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server Running on Port ${PORT}`);
console.log("HF Token Exists:", !!process.env.HF_TOKEN);
});
