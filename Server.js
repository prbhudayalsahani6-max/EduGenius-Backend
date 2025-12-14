import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_KEY; // 🔐 SAFE

app.post("/ai", async (req, res) => {
  try {
    const messages = req.body.messages;

    if (!messages || !Array.isArray(messages)) {
      return res.json({ reply: "❌ Invalid message format" });
    }

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are EduGenius AI.
You are friendly, respectful and human-like.
Help students from class 1–12 (Science, Commerce, Arts).
Solve Maths, Science, SST, Hindi, English, Gujarati, Sanskrit,
Accounts, Economics, Business Studies.
Help with coding (HTML, CSS, JS, Python, C, C++).
Explain only legal & ethical hacking concepts.
Always reply in numbered points with emojis.
Never use ** stars.
`
        },
        ...messages
      ]
    };

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + OPENAI_KEY
        },
        body: JSON.stringify(payload),
        timeout: 20000
      }
    );

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.json({ reply: "❌ OpenAI error, try again" });
    }

  } catch (err) {
    console.error(err);
    res.json({ reply: "❌ Server busy, try again" });
  }
});

app.get("/", (req, res) => {
  res.send("EduGenius AI Backend Running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
