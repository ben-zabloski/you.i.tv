import React, { useCallback, useEffect, useRef } from "react";
import "./Video.css";

type VideoProps = {
  id: string;
};

export function Video({ id }: VideoProps) {
  // https://developers.google.com/youtube/player_parameters

  let player = useRef<YT.Player>();

  useEffect(() => {
    const onReady = (event: YT.PlayerEvent) => {
      console.log("player onReady");
    };

    const loadPlayer = () => {
      player.current = new window.YT.Player(`VideoIFrame`, {
        events: {
          onReady: onReady,
        },
      });
    };

    if (!window.YT) {
      const element = document.createElement("script");
      element.src = "https://www.youtube.com/iframe_api";

      (window as any).onYouTubeIframeAPIReady = loadPlayer;

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(element, firstScriptTag);
    } else {
      loadPlayer();
    }
  }, []);

  const play = useCallback(() => {
    player.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    player.current?.pauseVideo();
  }, []);

  return (
    <>
      <div className="VideoContainer">
        <iframe
          id="VideoIFrame"
          className={id ? "Video" : "VideoHidden"}
          title="YouTube"
          src={`https://www.youtube.com/embed/${id}?autoplay=0&controls=0&enablejsapi=1`}
        ></iframe>
        <div className={id ? "VideoHidden" : "Video VideoMessagePadding"}>
          Try searching for a video! Why not search for some cat videos?
        </div>
      </div>
      {id && (
        <div>
          <button onClick={play}>Play</button>
          <button onClick={pause}>Pause</button>
        </div>
      )}
    </>
  );
}
