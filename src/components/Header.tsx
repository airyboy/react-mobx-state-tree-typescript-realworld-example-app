import * as React from "react";
import { Link } from "react-router-dom";
import { useStores } from "../common/useStore";
import { IUser } from "../stores/AuthStore";
import { observer } from "mobx-react-lite";

const Header: React.FC = () => {
  const store = useStores().authStore;

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          conduit
        </Link>

        {store.currentUser ? <PrivateView user={store.currentUser} /> : <PublicView />}
      </div>
    </nav>
  );
};

function PublicView() {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Sign in
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/register" className="nav-link">
          Sign up
        </Link>
      </li>
    </ul>
  );
}

function PrivateView({ user }: { user: IUser }) {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/new" className="nav-link">
          <i className="ion-compose"></i>&nbsp;New Post
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/settings" className="nav-link">
          <i className="ion-gear-a"></i>&nbsp;Settings
        </Link>
      </li>

      <li className="nav-item">
        <Link to={`/user/${user.username}`} className="nav-link">
          {user.image && <img src={user.image ?? ""} className="user-pic" alt={user.username} />}
          {user.username}
        </Link>
      </li>
    </ul>
  );
}

export default observer(Header);
