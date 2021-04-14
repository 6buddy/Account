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
} from "@material-ui/core";
import { useLocation } from "react-router";
import { enterPassword } from "../constant";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(() => ({
  root: {},
}));

export default function ResetPassword({ className, ...rest }) {
  const classes = useStyles();
  const location = useLocation();
  const paramId = location.hash.split("=")[1];
  const { enqueueSnackbar } = useSnackbar();

  if (!paramId) return null;
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        passwordConfirm: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("doit etre un email valide")
          .required("obligatoire"),
        password: Yup.string()
          .min(7, "Au minimum 7 caractères")
          .max(255)
          .required("obligatoire"),
        passwordConfirm: Yup.string()
          .oneOf(
            [Yup.ref("password"), null],
            "les mot de passe doivent etre égaux"
          )
          .required("obligatoire"),
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          // Make API request
          const data = await fetch(enterPassword, {
            method: "POST",
            body: JSON.stringify({
              password: values.password,
              recover_token: paramId,
              email: values.email,
            }),
            headers: {
              "content-type": "application/json",
            },
          });
          if (data.status !== 201 && data.status !== 200 && data.status !== 202)
            throw "Erreur";
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar("Vous avez bien réinitialiser votre mot de passe", {
            variant: "success",
          });
        } catch (error) {
          setStatus({ success: false });
          setErrors({ submit: error.message });
          setSubmitting(false);
          enqueueSnackbar(error, {
            variant: "error",
          });
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
            <CardHeader title="Changer votre mot de passe" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Adresse mail"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
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
                Changer votre mot de passe
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
}
