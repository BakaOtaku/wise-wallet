import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
// import Deploy from "@/pages/Deploy";
import Intent from "@/pages/Intent";
import Passkeys from "@/pages/Passkeys";
import Recovery from "@/pages/Recovery";

const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route exact path="/deploy" component={Deploy} /> */}
          <Route exact path="/account" component={Passkeys} />
          <Route exact path="/intent" component={Intent} />
          <Route exact path="/recover" component={Recovery} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
