import React, { useState } from "react";

function PlayButton({ id, text, handleIsRecording }) {
  const [isRecording, setIsRecording] = useState(false);
  return (
    <button id={id} onClick={handleIsRecording}>
      {text}
    </button>
  );
}

export default PlayButton;
