import React from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik } from "formik";
import {
    Box,
    Button,
    Card,
    Divider,
    FormHelperText,
    Grid,
    TextField,
    makeStyles,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    CardMedia,
    Typography,
} from "@material-ui/core";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";
import { confirmPro, confirmPatient } from "../constant";

const useStyles = makeStyles(() => ({
    root: {
        flexWrap: "nowrap",
        width: "100%",
        height: "100%",
        textAlign: "center",
        margin: "0",
    },
    form: {
        backgroundColor: "#F1F1EE",
        width: "100%",
        height: "100%",
    },
    title: {
        fontWeight: "bold",
    },
    subTitle: {
    },
    card: {
        padding: "30px",
    },
    signInButton: {
        backgroundColor: "#ED701C",
        color: "white",
        padding: "10px 40px",
        borderRadius: "8px",
        marginLeft: "auto",
    },
    select: {
        textAlign: "center",
    },
    inputGroup: {
        marginBottom: "20px",
    }
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
                role: 0,
                methodAuth: 0,
            }}
            validationSchema={Yup.object().shape({
                password: Yup.string()
                    .min(7, "Au minimum 8 caractères")
                    .max(255)
                    .required("obligatoire"),
                passwordConfirm: Yup.string()
                    .oneOf(
                        [Yup.ref("password"), null],
                        "Les mot de passe doivent être égaux"
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
                        "Les numéros de portable doivent être égaux"
                    )
                    .required("obligatoire"),
                mail: Yup.string()
                    .email("Doit être un email valide")
                    .required("obligatoire"),
                mailConfirm: Yup.string()
                    .oneOf(
                        [Yup.ref("mail"), null],
                        "Les emails doivent être égaux"
                    )
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
                        throw Error("Nom d'utilisateur invalide");

                    //@TODO redirect to patient app
                    enqueueSnackbar(
                        "Vous pouvez maitenant télécharger l'applicaton et commencer à l'utiliser",
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
                <form onSubmit={handleSubmit} className={classes.form}>
                    <Grid container alignItems="center" direction="column" className={classes.root} justify="space-evenly">
                        <Grid container direction="column" justify="center">
                            <Grid container justify="center">
                                <Grid item style={{ minWidth: "20px", maxWidth: "1000px" }}>
                                    <CardMedia component="img" image="Logo_cypios.svg" alt="logo cypios" />
                                </Grid>
                            </Grid>
                            <Grid item style={{ textAlign: "center" }}>
                                <Typography variant="h6" className={classes.title}>Inscrivez-vous à CYPIOSdiet</Typography>
                                <Typography variant="subtitle1" className={classes.subTitle}>et partagez dès maintenant vos effets secondaires avec votre professionel de santé habituel</Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item>
                                <Card container item className={classes.card} direction={"column"} spacing={3}>
                                    <Grid item className={classes.inputGroup}>
                                        <Typography>L'adresse email renseignée ansi que le mot de passe vous serviront pour vous connecter à l'application CYPIOSdiet.</Typography>
                                    </Grid>
                                    <Grid item xs={12} className={classes.inputGroup}>
                                        <Grid container direction="row" justify="space-evenly">
                                            <Grid item xs={5}>
                                                <TextField
                                                    error={Boolean(touched.mail && errors.mail)}
                                                    fullWidth
                                                    helpertext={touched.mail && errors.mail}
                                                    label="Email"
                                                    name="mail"
                                                    placeholder="adresse@email.com"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.mail}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField
                                                    error={Boolean(touched.mailConfirm && errors.mailConfirm)}
                                                    fullWidth
                                                    helpertext={touched.mailConfirm && errors.mailConfirm}
                                                    label="Confirmation email"
                                                    name="mailConfirm"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.mailConfirm}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item className={classes.inputGroup} >
                                        <Grid container direction="row" justify="space-evenly" >
                                            <Grid item xs={5}>
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
                                            <Grid item xs={5}>
                                                <TextField
                                                    error={Boolean(
                                                        touched.passwordConfirm && errors.passwordConfirm
                                                    )}
                                                    fullWidth
                                                    helperText={
                                                        touched.passwordConfirm && errors.passwordConfirm
                                                    }
                                                    label="Confirmation mot de passe"
                                                    name="passwordConfirm"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="password"
                                                    value={values.passwordConfirm}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item className={classes.inputGroup}>
                                        <Grid container direction="row" justify="space-evenly" >
                                            <Grid item xs={5}>
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
                                            <Grid item xs={5}>
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
                                        </Grid>
                                    </Grid>
                                    <Grid container xs={12} className={classes.inputGroup}>
                                        {/*<Grid item xs={6} className={classes.select}>*/}
                                        {/*    <FormControl variant="outlined" >*/}
                                        {/*        <InputLabel>Méthode de double authentification</InputLabel>*/}
                                        {/*        <Select*/}
                                        {/*            error={Boolean(*/}
                                        {/*                touched.methodAuth && errors.methodAuth*/}
                                        {/*            )}*/}
                                        {/*            helperText={*/}
                                        {/*                touched.methodAuth && errors.methodAuth*/}
                                        {/*            }*/}
                                        {/*            name="methodAuth"*/}
                                        {/*            value={values.methodAuth}*/}
                                        {/*            onChange={handleChange}*/}
                                        {/*            label="Méthode de double authentificiation"*/}
                                        {/*        >*/}
                                        {/*            <MenuItem value="-1">*/}
                                        {/*                <em>Selectionner une méthode</em>*/}
                                        {/*            </MenuItem>*/}
                                        {/*            <MenuItem value={0}>Code par Email</MenuItem>*/}
                                        {/*            <MenuItem value={1}>Code par Portable</MenuItem>*/}
                                        {/*        </Select>*/}
                                        {/*    </FormControl>*/}
                                        {/*</Grid>*/}
                                    </Grid>
                                    {errors.submit && (
                                        <Box mt={3}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Box>
                                    )}
                                    <Box p={2} display="flex" justifyContent="flex-end" style={{ padding: "0px" }}>
                                        <Button
                                            color="secondary"
                                            disabled={isSubmitting}
                                            type="submit"
                                            variant="contained"
                                            className={classes.signInButton}
                                        >
                                            Je m'inscris
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                        <Divider />

                    </Grid>
                </form >
            )
            }
        </Formik >
    );
}
