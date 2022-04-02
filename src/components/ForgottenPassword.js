import React, {useState} from "react";
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
import { useSnackbar } from "notistack";
import {resetPassword} from "../constant"
import {RSADecrypt, SignDate} from "../encrypt.lib.compiled";
const useStyles = makeStyles(() => ({
  root: {},
}));

export default function ForgottenPassword({ className, ...props }) {
  const [recovery, setRecovery] = useState();

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const key =decodeURI(props?.location?.search?.slice(1));

  if (!key)
    return <div>URL invalide (clef manquante)</div>
  if (key.length < 2048)
    return <div>URL invalide (clef trop petite)</div>

  if (recovery)
    return <div>{recovery}</div>

  return (
    <Formik
      initialValues={{
        email: "cypios2@yopmail.com",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("doit etre un email valide")
          .required("obligatoire"),
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          // Make API request
          const data = await fetch(
            `${resetPassword}`,
            {
              method: "POST",
              body: JSON.stringify({
                email: values.email,
                encryptedDate : await SignDate(key)
              }),
              headers: {
                "content-type": "application/json",
              },
            }
          );
          if (data.status !== 201 && data.status !== 200 && data.status !== 202)
            throw "Erreur";

          const json = await data.json();
          setRecovery(await RSADecrypt(json.recovery, key));
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar("Vous avez bien réinitialiser votre mot de passe", {
            variant: "success",
          });
        } catch (error) {
          console.log(error);
          setStatus({ success: false });
          setErrors({ submit: error.message });
          setSubmitting(false);
          enqueueSnackbar('Erreur', {
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
          <Card className={clsx(classes.root, className)} {...props}>
            <CardHeader title="Mot de passe oublié" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
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
                Mot de passe oublié
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
}
