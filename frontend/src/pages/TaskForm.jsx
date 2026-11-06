import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Paper, Typography, TextField, MenuItem, Button, Box, Alert } from "@mui/material";
import api from "../api";

const empty = { title: "", description: "", priority: "Medium", dueDate: "", status: "Pending" };

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      api.get(`/api/tasks/${id}`).then((res) => {
        const t = res.data;
        setForm({
          title: t.title,
          description: t.description || "",
          priority: t.priority,
          dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
          status: t.status,
        });
      });
    } else {
      setForm(empty);
    }
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) {
      setError("Title and due date are required.");
      return;
    }
    try {
      if (id) await api.put(`/api/tasks/${id}`, form);
      else await api.post("/api/tasks", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {id ? "Edit Task" : "Add Task"}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submit} sx={{ display: "grid", gap: 2 }}>
          <TextField label="Title" name="title" value={form.title} onChange={change} required />
          <TextField
            label="Description" name="description" value={form.description}
            onChange={change} multiline rows={3}
          />
          <TextField select label="Priority" name="priority" value={form.priority} onChange={change}>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField
            label="Due Date" name="dueDate" type="date" value={form.dueDate}
            onChange={change} InputLabelProps={{ shrink: true }} required
          />
          <TextField select label="Status" name="status" value={form.status} onChange={change}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </TextField>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained">
              {id ? "Update Task" : "Save Task"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/")}>Cancel</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}