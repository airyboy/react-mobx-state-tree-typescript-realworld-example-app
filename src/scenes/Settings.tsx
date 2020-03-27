import * as React from "react";
import { useStores } from "../common/useStore";
import { observer } from "mobx-react-lite";

const Settings: React.FC<{}> = () => {
  const authStore = useStores().authStore;

  const [image, setImage] = React.useState(authStore.currentUser?.image ?? "");
  const [username, setUsername] = React.useState(authStore.currentUser?.username ?? "");
  const [bio, setBio] = React.useState(authStore.currentUser?.bio ?? "");
  const [email, setEmail] = React.useState(authStore.currentUser?.email ?? "");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setImage(authStore.currentUser?.image ?? "");
    setUsername(authStore.currentUser?.username ?? "");
    setBio(authStore.currentUser?.bio ?? "");
    setEmail(authStore.currentUser?.email ?? "");
  }, [authStore.currentUser]);

  const changeField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;

    switch (e.target.name) {
      case "image":
        setImage(val);
        break;
      case "username":
        setUsername(val);
        break;
      case "bio":
        setBio(val);
        break;
      case "email":
        setEmail(val);
        break;
      case "password":
        setPassword(val);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    await authStore.updateUser(email, bio, image, username, password || undefined);
    // await store.createArticle(title, description, body, []);
    setIsLoading(false);
  };

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {/* <ListErrors errors={this.props.errors}></ListErrors> */}

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="url"
                    placeholder="URL of profile picture"
                    value={image}
                    name="image"
                    onChange={changeField}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    value={username}
                    name="username"
                    onChange={changeField}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    value={bio}
                    name="bio"
                    onChange={changeField}
                  ></textarea>
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    name="email"
                    onChange={changeField}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    name="password"
                    onChange={changeField}
                  />
                </fieldset>

                <button className="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={isLoading}>
                  Update Settings
                </button>
              </fieldset>
            </form>

            <hr />

            {/* <button className="btn btn-outline-danger" onClick={this.props.onClickLogout}>
              Or click here to logout.
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Settings);
