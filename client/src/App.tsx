import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import Intent from "@/pages/Intent";
import Passkeys from "@/pages/Passkeys";

const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/intent" component={Intent} />
          {/* <Route exact path="/passkeys" component={Passkeys} /> */}
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
