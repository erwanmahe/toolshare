"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function ItemsPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    // Check if logged in
    fetch("/api/session").then(async (res) => {
      if (!res.ok) router.replace("/");
    });
  }, [router]);

  React.useEffect(() => {
    fetch(`/api/items?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then(setItems);
  }, [search]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
      <Typography variant="h4" gutterBottom>Items</Typography>
      <TextField
        label="Search items"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 3, width: 300 }}
      />
      <List sx={{ width: 300 }}>
        {items.length === 0 && <ListItem><ListItemText primary="No items found" /></ListItem>}
        {items.map(item => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} secondary={item.description} />
          </ListItem>
        ))}
      </List>
      <Button sx={{ mt: 2 }} variant="outlined" color="primary" onClick={() => {
        fetch("/api/logout", { method: "POST" }).then(() => router.replace("/"));
      }}>Logout</Button>
    </Box>
  );
}
