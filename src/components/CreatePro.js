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
import { useSnackbar } from "notistack";
import { createPro } from "../constant";
const useStyles = makeStyles(() => ({
  root: {},
}));

export default function CreatePro({ className, ...rest }) {
  const classes = useStyles();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{
        lastname: "",
        firstname: "",
        mail: "",
        code: "",
      }}
      validationSchema={Yup.object().shape({
        lastname: Yup.string().required("obligatoire"),
        firstname: Yup.string().required("obligatoire"),
        mail: Yup.string()
          .email("doit etre un mail valide")
          .required("obligatoire"),
        code: Yup.string().required("obligatoire"),
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          // Make API request
          const data = await fetch(createPro, {
            method: "POST",
            body: JSON.stringify({
              email: values.mail,
              firstname: values.firstname,
              lastname: values.lastname
            }),
            headers: {
              "content-type": "application/json",
              "Authorization": `Bearer ${values.code}`
            },
          });
          if (data.status !== 201 && data.status !== 200 && data.status !== 202)
            throw "Erreur: code invalide";

            //@TODO redirct to pro website
          enqueueSnackbar(
            "Vous pouvez maitenant vous connecter sur votre application web",
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
            <CardHeader title="Inscription d'un nouveau professionel de santé" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.firstname && errors.firstname)}
                    fullWidth
                    helperText={touched.firstname && errors.firstname}
                    label="Prenom"
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.firstname}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.lastname && errors.lastname)}
                    fullWidth
                    helperText={touched.lastname && errors.lastname}
                    label="Nom"
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.lastname}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.mail && errors.mail)}
                    fullWidth
                    helperText={touched.mail && errors.mail}
                    label="Mail"
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
                    error={Boolean(touched.code && errors.code)}
                    fullWidth
                    helperText={touched.code && errors.code}
                    label="Code"
                    name="code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.code}
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
                Crée le compte
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
}
