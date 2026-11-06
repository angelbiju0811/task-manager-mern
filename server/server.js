require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const Task = mongoose.model(
  "Task",
  new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      description: { type: String, default: "" },
      priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
      dueDate: { type: Date, required: true },
      status: { type: String, enum: ["Pending", "Done"], default: "Pending" },
    },
    { timestamps: true }
  )
);

app.get("/", (req, res) => res.send("Task Manager API is running"));

app.get("/api/tasks", async (req, res) => {
  res.json(await Task.find().sort({ dueDate: 1 }));
});

app.get("/api/tasks/:id", async (req, res) => {
  res.json(await Task.findById(req.params.id));
});

app.post("/api/tasks", async (req, res) => {
  try {
    res.status(201).json(await Task.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    res.json(
      await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
    );
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.patch("/api/tasks/:id/status", async (req, res) => {
  res.json(
    await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  );
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => console.log("Server running"));
  })
  .catch((err) => console.error("DB connection error:", err.message));