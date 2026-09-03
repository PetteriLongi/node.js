import express from "express";

const app = express();
const PORT = 3000;

app.use("/public", express.static("public"));

app.get("/api/v1/cats", (req, res) => {
  res.json({
    cat_id: 1,
    name: "Kissa",
    birthdate: "2020-05-15",
    weight: 4.5,
    owner: "John",
    image: "https://loremflickr.com/320/240/cat",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
