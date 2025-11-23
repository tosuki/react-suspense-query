import { Mail, Phone } from "lucide-react";
import type { User } from "../../../services/user";

import "./css/styles.css";

export const UserCard = (props: User) => {
  return (
    <div className="user-card-container">
      <div className="card-header">
        <div className="card-thumb">
          <span>{props.name.charAt(0)}</span>
        </div>
        <div className="user-info">
          <h3>{props.name}</h3>
          <p>{props.email}</p>
        </div>
      </div>
      <div className="card-data">
        <div className="data-wrapper">
          <Mail />
          <span>{props.email}</span>
        </div>
        <div className="data-wrapper">
          <Phone />
          <span>{props.phone}</span>
        </div>
      </div>
    </div>
  );
};
