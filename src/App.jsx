//2160 x 5120

import React, { useEffect, useState } from "react";

const App = () => {
  const [distance, setDistance] = useState("Loading...");
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (!isBlocked) {
        if (["AB", "01", "02", "03"].includes(data.distance)) {
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
  }, [isBlocked]);

  const handleVideoEnd = () => {
    setIsBlocked(false);
  };

  const renderContent = () => {
    if (["07", "XX"].includes(distance)) {
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
          volume={1.0}
        />
      );
    } else if (["05", "04", "06"].includes(distance)) {
      return (
        <video
          src="2_cz_podejdz.mp4"
          autoPlay
          loop
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100vh",
            objectFit: "contain",
          }}
          volume={1.0}
        />
      );
    } else if (["02", "01", "AB", "03"].includes(distance)) {
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
          volume={1.0}
        />
      );
    }
  };

  return <div>{renderContent()}</div>;
};
