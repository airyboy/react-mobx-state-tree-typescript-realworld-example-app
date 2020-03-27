import * as React from "react";
import { Link } from "react-router-dom";
import { useStores } from "../common/useStore";

const Register: React.FC<{}> = () => {
  const store = useStores().authStore;

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoading(true);
      await store.register(username, email, password);
      setIsLoading(false);
    },
    [email, password, store, username]
  );

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3 col-xs-12">
        <h1 className="text-xs-center">Sign Up</h1>
        <p className="text-xs-center">
          <Link to="/login">Have an account?</Link>
        </p>

        {/* <ListErrors errors={this.props.errors} /> */}

        <form onSubmit={handleSubmit}>
          <fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </fieldset>

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
              Sign up
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Register;
