import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, IconButton, Switch, LinearProgress, Box, Chip, Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";

const priorityColor = { High: "error", Medium: "warning", Low: "success" };

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data);
      setError("");
    } catch {
      setError("Could not load tasks. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (task) => {
    await api.patch(`/api/tasks/${task._id}/status`, {
      status: task.status === "Done" ? "Pending" : "Done",
    });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/api/tasks/${id}`);
    load();
  };

  const done = tasks.filter((t) => t.status === "Done").length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">
          {done} of {tasks.length} tasks completed ({percent}%)
        </Typography>
        <Box sx={{ mt: 1 }}>
          <LinearProgress variant="determinate" value={percent} sx={{ height: 10, borderRadius: 5 }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Total: {tasks.length} | Completed: {done} | Pending: {tasks.length - done}
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Done</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((t) => (
              <TableRow key={t._id}>
                <TableCell sx={{ textDecoration: t.status === "Done" ? "line-through" : "none" }}>
                  {t.title}
                </TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>
                  <Chip label={t.priority} color={priorityColor[t.priority]} size="small" />
                </TableCell>
                <TableCell>{new Date(t.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Switch checked={t.status === "Done"} onChange={() => toggle(t)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => navigate(`/edit/${t._id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => remove(t._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tasks yet. Click "Add Task" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}