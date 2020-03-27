import * as React from "react";

import { Link } from "react-router-dom";

interface ITabButtonProps {
  isActive: boolean;
  url: string;
}

const TabButton: React.FC<ITabButtonProps> = ({ isActive, url, children }) => (
  <li className="nav-item">
    <Link className={"nav-link " + (isActive ? "active" : "")} to={url}>
      {children}
    </Link>
  </li>
);

export default TabButton;
