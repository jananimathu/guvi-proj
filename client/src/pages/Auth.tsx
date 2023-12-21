import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { API } from "../axios";
import {
  Alert,
  AlertColor,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Auth = () => {
  const [registerMode, setRegisterMode] = useState(false);
  const [AlertMode, setAlertMode] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { open, message, severity } = AlertMode;
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignInToggle = () => {
    setRegisterMode((prev) => !prev);
    reset();
  };

  const handleToken = (res: any) => {
    localStorage.setItem("token", res.data.token);
  };

  const handleClose = () => {
    setAlertMode((prev) => ({
      open: false,
      message: prev.message,
      severity: prev.severity,
    }));
  };

  const onSubmit = (e: any) => {
    setLoading(true);
    if (registerMode && e.password != e.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Password and Confirm Password should be same",
      });
      return;
    }
    if (registerMode) {
      API.post("user/signup", e)
        .then((res) => {
          setAlertMode({
            open: true,
            message: "Registered Successfully",
            severity: "success",
          });
          setLoading(false);
          handleToken(res);
          setTimeout(() => {
            navigate("/profile");
          }, 3000);
        })
        .catch((err) => {
          setAlertMode({
            open: true,
            message: err.response.data.error,
            severity: "error",
          });
        });
    } else {
      API.post("user/signin", e)
        .then((res) => {
          setLoading(false);
          handleToken(res);
          navigate("/profile");
        })
        .catch((err) => {
          setAlertMode({
            open: true,
            message: err.response.data.error,
            severity: "error",
          });
        });
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={severity as AlertColor}
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          {message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {registerMode ? "Sign Up" : "Sign In"}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            {registerMode && (
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Name is required",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                      autoComplete="given-name"
                    />
                  )}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                    message: "Invalid Email",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    autoComplete="email"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password should be atleast 6 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    autoComplete="new-password"
                  />
                )}
              />
            </Grid>

            {registerMode && (
              <Grid item xs={12}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Confirm Password is required",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      error={Boolean(errors.confirmPassword)}
                      helperText={errors.confirmPassword?.message}
                      autoComplete="new-password"
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <CircularProgress sx={{ color: "white" }} size={20} />
            ) : registerMode ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>
          <Grid container justifyContent="flex-end" sx={{ cursor: "pointer" }}>
            <Grid item>
              <Link variant="body2" onClick={handleSignInToggle}>
                {registerMode
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Auth;
