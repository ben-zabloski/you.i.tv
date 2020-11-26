import React, { useCallback, useRef } from "react";
import { useStore } from "../../core/useStore";
import { Header } from "../Header/Header";
import { List } from "../List/List";
import { TextField } from "../TextField/TextField";
import { Thumbnail } from "../Thumbnail/Thumbnail";
import { Video } from "../Video/Video";
import "./App.css";

const SEARCH_DEBOUNCE_TIMEOUT = 500;

function App() {
  const timeoutRef = useRef<number>();
  const search = useStore((state) => state.search);
  const setAPIKey = useStore((state) => state.setAPIKey);
  const selectVideo = useStore((state) => state.selectVideo);
  const searchQuery = useStore((state) => state.searchQuery);
  const searchError = useStore((state) => state.searchError);
  const videos = useStore((state) => state.videos);
  const videosByID = useStore((state) => state.videosByID);
  const selectedVideoID = useStore((state) => state.selectedVideoID);
  const selectedVideo = videosByID[selectedVideoID];
  const title = selectedVideo?.snippet.title ?? "";
  const description = selectedVideo?.snippet.description ?? "";
  const channelName = selectedVideo?.snippet.channelTitle ?? "";

  const searchedVideos = videos[searchQuery];

  const searchOnChange = useCallback(
    (event) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        search(event.target.value);
      }, SEARCH_DEBOUNCE_TIMEOUT);

      return () => {
        window.clearTimeout(timeoutRef.current);
      };
    },
    [search]
  );

  const apiKeyOnChange = useCallback(
    (event) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setAPIKey(event.target.value);
      }, SEARCH_DEBOUNCE_TIMEOUT);

      return () => {
        window.clearTimeout(timeoutRef.current);
      };
    },
    [setAPIKey]
  );

  const thumbnailOnClick = useCallback((id) => selectVideo(id), [selectVideo]);

  // TODO: Better encapsulate application/header components...

  return (
    <div className="App">
      <Header>
        <div className="AppHeaderSection">
          <div className="AppSearchText">Search:</div>
          <TextField onChange={searchOnChange} />
        </div>
        <div className="AppHeaderSectionEnd">
          <div className="AppSearchText">
            <a
              href="https://console.developers.google.com/apis/credentials?project=potent-veld-254900&folder=&organizationId="
              rel="noreferrer"
              target="_blank"
            >
              API Key:
            </a>
          </div>
          <TextField onChange={apiKeyOnChange} />
        </div>
      </Header>
      <div className="AppContent">
        {searchError ? (
          <div className="AppErrorContainer">
            Error: <div dangerouslySetInnerHTML={{ __html: searchError }} />
          </div>
        ) : (
          <div className="AppVideoContainer">
            <Video id={selectedVideoID} />
            <div className="AppVideoTitle">{title}</div>
            <div className="AppVideoDescription">{description}</div>
            <div className="AppVideoChannel">{channelName}</div>
          </div>
        )}
        <List>
          {searchedVideos &&
            searchedVideos.map((videoID) => (
              <Thumbnail
                key={videoID}
                id={videoID}
                alt={videosByID[videoID]?.snippet.title}
                source={videosByID[videoID]?.snippet.thumbnails.default.url}
                onClick={thumbnailOnClick}
              />
            ))}
        </List>
      </div>
    </div>
  );
}

export default App;
