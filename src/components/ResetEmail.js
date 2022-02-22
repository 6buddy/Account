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
import { resetEmail } from "../constant";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(() => ({
    root: {},
}));

export default function ResetEmail({ className, ...rest }) {
    const classes = useStyles();
    const location = useLocation();
    const paramId = location.hash.split("=")[1];
    const { enqueueSnackbar } = useSnackbar();
    if (!paramId) return null;

    return (
        <Formik
            initialValues={{
                email: "",
                newEmail: ""
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email("doit etre un email valide")
                    .required("obligatoire"),
                newEmail: Yup.string()
                    .email("doit etre un email valide")
                    .required("obligatoire")
            })}
            onSubmit={async (
                values,
                { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
                try {
                    // Make API request
                    const data = await fetch(resetEmail, {
                        method: "POST",
                        body: JSON.stringify({
                            reset_email_token: paramId,
                            email: values.email,
                            newEmail: values.newEmail
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
                    enqueueSnackbar("Vous avez bien changer votre adresse mail", {
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
                        <CardHeader title="Changer votre email" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item md={4} sm={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.email && errors.email)}
                                        fullWidth
                                        helperText={touched.email && errors.email}
                                        label="Adresse mail actuelle"
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.newEmail && errors.newEmail)}
                                        fullWidth
                                        helperText={touched.newEmail && errors.newEmail}
                                        label="Nouvelle adresse mail"
                                        name="newEmail"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.newEmail}
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
                                Changer votre adresse mail
                            </Button>
                        </Box>
                    </Card>
                </form>
            )}
        </Formik>
    );
}
