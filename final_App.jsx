//2160 x 5120

import React, { useEffect, useState } from "react";

const App = () => {
  const [distance, setDistance] = useState("Loading...");
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.distance && !isBlocked) {
        if (data.distance === "AB") {
          setIsBlocked(true);
          setDistance("AB");
          setTimeout(() => setIsBlocked(false), 5000);
        } else {
          setDistance(data.distance);
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket zamknięty");
    };

    return () => {
      ws.close();
    };
  }, [isBlocked]);

  const renderContent = () => {
    if (["06", "07", "XX"].includes(distance)) {
      return (
        <video
          src="exon1.mp4"
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      );
    } else if (["05", "04", "03"].includes(distance)) {
      return (
        <img
          src="exon2.png"
          alt="Exon2"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      );
    } else if (["02", "01"].includes(distance)) {
      return (
        <img
          src="exon3.png"
          alt="Exon3"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      );
    } else if (distance === "AB") {
      return (
        <img
          src="exon4.png"
          alt="Exon4"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      );
    } else {
      return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Aktualny dystans:</h1>
          <h2>{distance}</h2>
        </div>
      );
    }
  };

  return <div>{renderContent()}</div>;
};

export default App;
