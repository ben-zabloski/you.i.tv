import create from "zustand";
import { normalize } from "./normalize";

const API = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&type=video`;

type Thumbnail = {
  height: number;
  url: string;
  width: number;
};

type Video = {
  id: {
    kind: string;
    videoId: string;
  };
  etag: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: string;
    publishedAt: string;
    thumbnails: {
      default: Thumbnail;
      high: Thumbnail;
      medium: Thumbnail;
    };
    title: string;
  };
};

export type State = {
  apiKey: string;
  search: (text: string) => void;
  setAPIKey: (text: string) => void;
  selectVideo: (videoID: string) => void;
  searchQuery: string;
  searchError: null | string;
  selectedVideoID: string;
  videos: Record<string, string[]>;
  videosByID: Record<string, Video>;
};

const getLocalStorage = (key: string): any => {
  const item = window.localStorage.getItem(key);
  if (!item) return null;

  return JSON.parse(item);
};

const setLocalStorage = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const useStore = create<State>((set, get) => {
  return {
    search: async (text) => {
      if (text === "") return;

      const state = get();

      const cached = state.videos[text];
      if (cached) {
        set({
          searchError: null,
          searchQuery: text,
          selectedVideoID: cached[0],
        });
        return;
      } else {
        set({ searchError: null, searchQuery: text });
      }

      const response = await fetch(`${API}&q=${text}&key=${state.apiKey}`);
      const json = await response.json();

      if (response.status !== 200) {
        set({ searchError: json.error.message });
        return;
      }

      const normalizedData = normalize(json);

      set((state) => {
        const videos = {
          ...state.videos,
          [text]: normalizedData.result,
        };

        const videosByID = {
          ...state.videosByID,
          ...normalizedData.entities.videos,
        };

        setLocalStorage("videos", videos);
        setLocalStorage("videosByID", videosByID);

        return {
          searchQuery: text,
          selectedVideoID: normalizedData.result[0],
          videos,
          videosByID,
        };
      });
    },

    setAPIKey: (text: string) => {
      set({ apiKey: text });

      const state = get();

      state.search(state.searchQuery);
    },

    selectVideo: (videoID) => {
      set({ selectedVideoID: videoID });
    },

    apiKey: "",

    searchQuery: "",
    searchError: null,
    selectedVideoID: "", // oHZ8XQs-HUA

    videos: getLocalStorage("videos") ?? [],
    videosByID: getLocalStorage("videosByID") ?? {},
  };
});
