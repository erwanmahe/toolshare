"use client";
import * as React from "react";
import {
  Box, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel, Card, CardContent, CardActions, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const toolTypes = ["general", "painting", "electricity", "plumbing"];
const toolStates = ["new", "used", "broken"];

import Snackbar from "@mui/material/Snackbar";

export default function ToolsPage() {
  const [tools, setTools] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [state, setState] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);

  // For add/edit dialogs
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTool, setEditTool] = React.useState<any>(null);
  const [form, setForm] = React.useState({ name: "", owner: "", state: "new", type: "general", description: "" });

  // For permissions
  const [username, setUsername] = React.useState<string | null>(null);
  const [snack, setSnack] = React.useState<string>("");

  // ...

  React.useEffect(() => {
    fetch("/api/session")
      .then(res => res.ok ? res.json() : Promise.reject(new Error("/api/session is broken")))
      .then(data => {
        setUsername(data?.username || null);
        // console.log("Fetched session data:", data);
      })
      .catch(() => {
        setUsername(null);
        console.log("Failed to fetch session");
      });
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (owner) params.append("owner", owner);
    if (state) params.append("state", state);
    if (search) params.append("search", search);
    fetch(`/api/tools?${params.toString()}`)
      .then(res => res.json())
      .then(setTools);
  }, [type, owner, state, search, refresh]);

  const handleOpenDialog = (tool?: any) => {
    setEditTool(tool || null);
    setForm(tool ? { ...tool } : { name: "", owner: username ?? "", state: "new", type: "general", description: "" });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  const handleFormChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editTool) {
        const res = await fetch(`/api/tools/${editTool.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          if (res.status === 403) setSnack("You can only edit your own tools.");
          else setSnack("Failed to edit tool.");
        }
      } else {
        await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setDialogOpen(false);
      setRefresh(r => r + 1);
    } catch {
      setSnack("Failed to save tool.");
    }
  };

  const handleDelete = async (id: number, toolOwner: string) => {
    if (toolOwner !== username) {
      setSnack("You can only delete your own tools.");
      return;
    }
    const res = await fetch(`/api/tools/${id}`, { method: "DELETE" });
    if (!res.ok) {
      if (res.status === 403) setSnack("You can only delete your own tools.");
      else setSnack("Failed to delete tool.");
    }
    setRefresh(r => r + 1);
  };

  if (username === null) {
    return <Box sx={{ maxWidth: '100%', width: '100%', mx: "auto", mt: 6 }}><Typography variant="h6">Not logged...</Typography></Box>;
  }

  return (
    <div>
      <Typography variant="subtitle1" color="secondary" sx={{ mb: 2 }}>
        Logged in as: {username}
      </Typography>
      <Box sx={{ maxWidth: '100%', mx: "auto", mt: 6 }}>
      <Typography variant="h4" gutterBottom>Tool List</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={e => setType(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {toolTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>State</InputLabel>
          <Select value={state} label="State" onChange={e => setState(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {toolStates.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="Owner" value={owner} onChange={e => setOwner(e.target.value)} />
      </Box>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }} disabled={!username}>Add Tool</Button>
      <Grid container spacing={3} justifyContent="flex-start" alignItems="stretch">
  {tools.map(tool => {
    const isOwner = username === tool.owner;
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={tool.id} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          sx={{
            width: 300,
            height: 180,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            ...(isOwner ? {
              cursor: "pointer",
              transition: '0.2s',
              '&:hover': { boxShadow: 6, transform: 'scale(1.025)' }
            } : { cursor: 'default' })
          }}
          onClick={isOwner ? () => handleOpenDialog(tool) : undefined}
        >
                <CardContent sx={{ width: '100%', height: '100%' }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">{tool.name}</Typography>
                    <Box display="flex" gap={1}>
                      <Chip label={tool.state} color={tool.state === 'broken' ? 'error' : tool.state === 'new' ? 'success' : 'warning'} size="small" />
                      <Chip label={tool.type} color="primary" size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mt={1} mb={1} sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    maxHeight: 44, // ~2 lines
                    position: 'relative',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0) 70%, #fff 100%)',
                  }}>
                    {tool.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Owner: {tool.owner}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                  <IconButton
                    edge="end"
                    color={isOwner ? "primary" : "default"}
                    disabled={!isOwner}
                    onClick={e => { e.stopPropagation(); if (isOwner) handleOpenDialog(tool); }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color={isOwner ? "error" : "default"}
                    disabled={!isOwner}
                    onClick={e => { e.stopPropagation(); if (isOwner) handleDelete(tool.id, tool.owner); }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editTool ? "Edit Tool" : "Add Tool"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} fullWidth />
          <TextField label="Owner" name="owner" value={form.owner} onChange={handleFormChange} fullWidth disabled />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select name="type" value={form.type} label="Type" onChange={handleFormChange}>
              {toolTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select name="state" value={form.state} label="State" onChange={handleFormChange}>
              {toolStates.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Description" name="description" value={form.description} onChange={handleFormChange} fullWidth multiline minRows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!snack}
        autoHideDuration={3500}
        onClose={() => setSnack("")}
        message={snack}
      />
    </Box>
    </div>
  );
}
