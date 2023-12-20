import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertColor,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Snackbar,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import * as jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { API } from "../axios";
const Profile = () => {
  const [AlertMode, setAlertMode] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { open, message, severity } = AlertMode;

  const handleClose = () => {
    setAlertMode((prev) => ({
      open: false,
      message: prev.message,
      severity: prev.severity,
    }));
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      age: "",
      gender: "",
      dob: "",
      mobile: "",
      address: "",
    },
  });

  const navigate = useNavigate();

  const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode.jwtDecode(token);
      return decodedToken.exp ? Date.now() >= decodedToken.exp * 1000 : true;
    }
    return true;
  };

  useEffect(() => {
    if (isTokenExpired()) {
      handleLogout();
    } else {
      fetchProfile();
    }
  }, []);

  const fetchProfile = () => {
    API.get("/user/getProfile").then((res) => {
      const data = res.data.result;
      setValue("age", data.age ? data.age : "");
      setValue("gender", data.gender);
      setValue("dob", data.dob);
      setValue("mobile", data.mobile);
      setValue("address", data.address);
    });
  };

  const onSubmit = (e: any) => {
    API.post("user/updateProfile", e)
      .then(() => {
        setAlertMode({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        });
        fetchProfile();
      })
      .catch((err) => {
        setAlertMode({
          open: true,
          message: err.response.data.error,
          severity: "error",
        });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container component="main" maxWidth="xs">
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
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="age"
                control={control}
                defaultValue=""
                rules={{
                  min: {
                    value: 1,
                    message: "Age must be greater than 0",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Age"
                    fullWidth
                    error={Boolean(errors.age)}
                    helperText={errors.age?.message}
                    autoComplete="tel"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Gender
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Other"
                      />
                    </RadioGroup>
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel id="demo-row-radio-buttons-group-label">DOB</FormLabel>
              <Controller
                name="dob"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} type="date" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{
                  minLength: {
                    value: 6,
                    message: "Address should be atleast 6 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="mobile"
                control={control}
                defaultValue=""
                rules={{
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Invalid Mobile Number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile Number"
                    fullWidth
                    error={Boolean(errors.mobile)}
                    helperText={errors.mobile?.message}
                    autoComplete="tel"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
