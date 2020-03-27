import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { useStores } from "../common/useStore";

const Login: React.FC<{}> = () => {
  const store = useStores().authStore;
  const history = useHistory();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoading(true);
      await store.login(email, password);
      setIsLoading(false);
      history.replace("/");
    },
    [email, history, password, store]
  );

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3 col-xs-12">
        <h1 className="text-xs-center">Sign In</h1>
        <p className="text-xs-center">
          <Link to="/register">Need an account?</Link>
        </p>

        {/* <ListErrors errors={this.props.errors} /> */}

        <form onSubmit={handleSubmit}>
          <fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </fieldset>

            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </fieldset>

            <button className="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={isLoading}>
              Sign in
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Login;
