import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack"
import Home from "./components/Home";
import ConfirmAccount from "./components/Confirm"
import ForgottenPassword from "./components/ForgottenPassword";
import CreatePro from "./components/CreatePro";
import Error from "./components/Error";
import ResetPassword from "./components/ResetPassword"
import ResetEmail from "./components/ResetEmail";
class App extends Component {
    render() {
        return (
            <BrowserRouter style={{ height: "100%", width: "100%" }}>
                <SnackbarProvider maxSnack={1} style={{ height: "100%", width: "100%" }}>
                    <div style={{ height: "100%", width: "100%" }}>
                        <Switch style={{ height: "100%", width: "100%" }}>
                            <Route path="/" component={Home} exact />
                            <Route path="/confirm" component={ConfirmAccount} />
                            <Route path="/change/email" component={ResetEmail} />
                            <Route path="/reset/password" component={ResetPassword} />
                         
                            <Route path="/reset" component={ForgottenPassword} />
                            <Route path="/pro/create" component={CreatePro} />
                            <Route component={Error} />
                        </Switch>
                    </div>
                </SnackbarProvider>
            </BrowserRouter>
        );
    }
}

export default App;
