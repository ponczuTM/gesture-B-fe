import React, { useEffect, useState, useRef } from "react";
import "./App.css";

const App = () => {
  const [distance, setDistance] = useState("Loading...");
  const [isBlocked, setIsBlocked] = useState(false);
  const [videoPriority, setVideoPriority] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (!isBlocked) {
        if (["AB", "01", "02", "03", "04"].includes(data.distance)) {
          setDistance("AB");
          setVideoPriority("video3");
          setIsBlocked(true);
        } else if (["05", "06", "07"].includes(data.distance)) {
          setDistance(data.distance);
          setVideoPriority("video2");
          setIsBlocked(true);
        } else if (data.distance === "XX" && videoPriority !== "video3") {
          setDistance("XX");
          setVideoPriority("video2");
        } else {
          setDistance(data.distance);
        }
      }
    };

    ws.onclose = () => {};

    return () => {
      ws.close();
    };
  }, [isBlocked, videoPriority]);

  const handleVideoEnd = () => {
    setIsBlocked(false);
    setVideoPriority(null);
  };

  const renderContent = () => {
    if (
      videoPriority === "video3" ||
      ["02", "01", "AB", "03", "04"].includes(distance)
    ) {
      return (
        <video
          ref={videoRef}
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
    } else if (
      videoPriority === "video2" ||
      ["05", "06", "07"].includes(distance)
    ) {
      return (
        <div className="video-container">
          <video
            ref={videoRef}
            src="2_cz_podejdz.mp4"
            autoPlay
            loop={distance === "XX"}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100vh",
              objectFit: "contain",
            }}
            volume={1.0}
            onEnded={() => {
              if (!["XX", "05", "06", "07"].includes(distance)) {
                handleVideoEnd();
              }
            }}
          />
          <div className="message">PODEJDŹ BLIŻEJ</div>
        </div>
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

export default App;
