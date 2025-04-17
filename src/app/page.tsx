"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: { mode: "light" },
});

export default function Home() {
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [registerValues, setRegisterValues] = React.useState({ username: "", password: "", confirm: "" });
  const [registerError, setRegisterError] = React.useState("");
  const [loginValues, setLoginValues] = React.useState({ username: "", password: "" });

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterValues({ ...registerValues, [e.target.name]: e.target.value });
    if (e.target.name === "confirm") {
      const pw = registerValues.password;
      const cf = e.target.value;
      setRegisterError(pw && cf && pw !== cf ? "Passwords do not match" : "");
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginValues({ ...loginValues, [e.target.name]: e.target.value });
  };

  const [loginError, setLoginError] = React.useState("");
  const [registerApiError, setRegisterApiError] = React.useState("");
  const router = useRouter();

  const handleRegisterSubmit = async () => {
    setRegisterApiError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: registerValues.username, password: registerValues.password })
      });
      if (res.ok) {
        setOpenRegister(false);
        setRegisterValues({ username: "", password: "", confirm: "" });
        router.push("/items");
      } else {
        const data = await res.json();
        setRegisterApiError(data.error || "Registration failed");
      }
    } catch (err) {
      setRegisterApiError("Registration failed");
    }
  };

  const handleLoginSubmit = async () => {
    setLoginError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginValues)
      });
      if (res.ok) {
        setOpenLogin(false);
        setLoginValues({ username: "", password: "" });
        router.push("/items");
      } else {
        const data = await res.json();
        setLoginError(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("Login failed");
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={4}>
        <Typography variant="h2" gutterBottom color="primary">Tool Share</Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => setOpenLogin(true)}>
            Login
          </Button>
          <Button variant="outlined" color="primary" onClick={() => setOpenRegister(true)}>
            Register
          </Button>
        </Box>
        {/* Login Dialog */}
        <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth label="Username" name="username" value={loginValues.username} onChange={handleLoginChange} autoFocus />
              <TextField margin="normal" required fullWidth label="Password" name="password" type="password" value={loginValues.password} onChange={handleLoginChange} />
              {loginError && <Box color="error.main" mt={1}>{loginError}</Box>}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLogin(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleLoginSubmit}>Login</Button>
          </DialogActions>
        </Dialog>
        {/* Register Dialog */}
        <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth label="Username" name="username" value={registerValues.username} onChange={handleRegisterChange} />
              <TextField margin="normal" required fullWidth label="Password" name="password" type="password" value={registerValues.password} onChange={handleRegisterChange} />
              <TextField margin="normal" required fullWidth label="Confirm Password" name="confirm" type="password" value={registerValues.confirm} onChange={handleRegisterChange} error={!!registerError} helperText={registerError} />
              {registerApiError && <Box color="error.main" mt={1}>{registerApiError}</Box>}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRegister(false)}>Cancel</Button>
            <Button variant="contained" color="primary" disabled={registerValues.password !== registerValues.confirm || !registerValues.password || !registerValues.username} onClick={handleRegisterSubmit}>Register</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}