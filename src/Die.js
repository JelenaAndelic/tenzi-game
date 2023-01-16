import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Die(props) {
  return (
    <div className="die-face" onClick={props.holdDice}>
      <FontAwesomeIcon
        icon={["fas", `fa-dice-${props.value}`]}
        className={`${props.isHeld ? "Die-held" : "Die"} ${
          props.rolling && "Die-shaking"
        }`}
      />
    </div>
  );
}

export default Die;
