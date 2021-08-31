import React from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";
import { confirmPro, confirmPatient } from "../constant";

const useStyles = makeStyles(() => ({
  root: {},
}));

export default function ConfirmAccount({ className, ...rest }) {
  const classes = useStyles();
  const location = useLocation();
  const paramId = location.hash.split("=")[1];
  const { enqueueSnackbar } = useSnackbar();

  if (!paramId) return null;
  return (
    <Formik
      initialValues={{
        password: "",
        passwordConfirm: "",
        phone: "",
        phoneConfirm: "",
        mail: "",
        role: -1,
        methodAuth: -1,
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(7, "Au minimum 8 caractères")
          .max(255)
          .required("obligatoire"),
        passwordConfirm: Yup.string()
          .oneOf(
            [Yup.ref("password"), null],
            "les mot de passe doivent etre égaux"
          )
          .required("obligatoire"),
        phone: Yup.string()
          .min(10, "06/07XXXXXXXX")
          .max(10)
          .matches(/^[0-9]{10}$/, "06/07XXXXXXXX")
          .required("obligatoire"),
        phoneConfirm: Yup.string()
          .oneOf(
            [Yup.ref("phone"), null],
            "les numéro de portable doivent etre égaux"
          )
          .required("obligatoire"),
        mail: Yup.string()
          .email("doit etre un email valide")
          .required("obligatoire"),
        role: Yup.number().min(0).max(1).required("obligatoire"),
        methodAuth: Yup.number().min(0).max(1).required("obligatoire")
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          // Make API request
          let url;
          if (values.role === 0) url = confirmPatient;
          else url = confirmPro;
          const data = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
              password: values.password,
              invite_token: paramId,
              email: values.mail,
              phone: values.phone,
              methodAuth: values.methodAuth
            }),
            headers: {
              "content-type": "application/json",
            },
          });
          if (data.status !== 201 && data.status !== 200 && data.status !== 202)
            throw "Nom d'utilisateur invalide";

          //@TODO redirct to pro website
          enqueueSnackbar(
            "Vous pouvez maitenant vous connecter sur votre interface web",
            {
              variant: "success",
            }
          );
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
        } catch (error) {
          enqueueSnackbar("erreur", {
            variant: "error",
          });
          setStatus({ success: false });
          setErrors({ submit: error.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader title="Confirmer votre compte sur Cypios" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.mail && errors.mail)}
                    fullWidth
                    helperText={touched.mail && errors.mail}
                    label="Email"
                    name="mail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.mail}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Mot de passe"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(
                      touched.passwordConfirm && errors.passwordConfirm
                    )}
                    fullWidth
                    helperText={
                      touched.passwordConfirm && errors.passwordConfirm
                    }
                    label="Confirmation"
                    name="passwordConfirm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.passwordConfirm}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.phone && errors.phone)}
                    fullWidth
                    helperText={touched.phone && errors.phone}
                    label="Numéro de portable (06XXXXXXXX)"
                    name="phone"
                    onChange={handleChange}
                    type="text"
                    value={values.phone}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(
                      touched.phoneConfirm && errors.phoneConfirm
                    )}
                    fullWidth
                    helperText={
                      touched.phoneConfirm && errors.phoneConfirm
                    }
                    label="Confirmation numéro de portable"
                    name="phoneConfirm"
                    onChange={handleChange}
                    type="text"
                    value={values.phoneConfirm}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl variant="outlined">
                    <InputLabel>Méthode de double authentification</InputLabel>
                    <Select
                      error={Boolean(
                        touched.methodAuth && errors.methodAuth
                      )}
                      helperText={
                        touched.methodAuth && errors.methodAuth
                      }
                      name="methodAuth"
                      value={values.methodAuth}
                      onChange={handleChange}
                      label="Méthode de double authentificiation"
                    >
                      <MenuItem value="-1">
                        <em>Selectionner une méthode</em>
                      </MenuItem>
                      <MenuItem value={0}>Code par Email</MenuItem>
                      <MenuItem value={1}>Code par Portable</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item md={4} sm={6} xs={12} style={{ marginTop: "20px" }}>
                <FormControl variant="outlined">
                  <InputLabel>Role</InputLabel>
                  <Select
                    error={Boolean(
                      touched.role && errors.role
                    )}
                    helperText={
                      touched.role && errors.role
                    }
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value="-1">
                      <em>Selectionner un role</em>
                    </MenuItem>
                    <MenuItem value={0}>Patient</MenuItem>
                    <MenuItem value={1}>Professionel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
            </CardContent>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              <Button
                color="secondary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                Confirmer votre compte
              </Button>
            </Box>
          </Card>
        </form>
      )
      }
    </Formik >
  );
}
