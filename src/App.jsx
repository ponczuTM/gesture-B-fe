import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [distance, setDistance] = useState("Loading...");
  const [isBlocked, setIsBlocked] = useState(false);
  const [canReactToChange, setCanReactToChange] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (!isBlocked && canReactToChange) {
        if (["AB", "01", "02", "03", "04"].includes(data.distance)) {
          setDistance("AB");
          setIsBlocked(true);
        } else {
          setDistance(data.distance);
        }
      }
    };

    ws.onclose = () => {};

    return () => {
      ws.close();
    };
  }, [isBlocked, canReactToChange]);

  const handleVideoEnd = () => {
    setIsBlocked(false);
  };

  const handleVideoStart = () => {
    setCanReactToChange(false);
    setTimeout(() => {
      setCanReactToChange(true);
    }, 5000);
  };

  const renderContent = () => {
    if (["XX"].includes(distance)) {
      return (
        <video
          src="1_cz_logo.mp4"
          autoPlay
          loop
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100vh",
            objectFit: "contain",
          }}
        />
      );
    } else if (["05", "06", "07"].includes(distance)) {
      return (
        <div className="video-container">
          <video
            src="2_cz_podejdz.mp4"
            autoPlay
            onPlay={handleVideoStart}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100vh",
              objectFit: "contain",
            }}
            volume={1.0}
          />
          <div className="message">PODEJDŹ BLIŻEJ</div>
        </div>
      );
    } else if (["02", "01", "AB", "03", "04"].includes(distance)) {
      return (
        <video
          src="3_cz_robot.mp4"
          autoPlay
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100vh",
            objectFit: "contain",
          }}
          volume={1.0}
          onEnded={handleVideoEnd}
        />
      );
    } else {
      return (
        <video
          src="1_cz_logo.mp4"
          autoPlay
          loop
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100vh",
            objectFit: "contain",
          }}
          volume={0.1}
        />
      );
    }
  };

  return <div>{renderContent()}</div>;
};

export default App;
