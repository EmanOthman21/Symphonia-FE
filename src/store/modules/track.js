import axios from "axios";

const state = {
  token: "",

  audioElement: undefined,

  trackName: "",
  trackUrl: null,
  trackId: null,
  trackArtistName: "",
  trackTotalDuration: 0,
  trackTotalDurationMs: 0,
  isTrackLiked: null,
  isTrackPaused: true,
  isTrackLoaded: false,
  isCurTrkReady: false,
  isFirstTrackInQueue: true,
  isLastTrackInQueue: true,
  isNextAndPreviousFinished: true,
  isBuffering: false,

  trackAlbumImageUrl: null,
  trackAlbumId: null,
  trackAlbumName: "",

  isQueueOpened: false,
  queueTracks: [],
  queueNextTracks: [],
};

const mutations = {
  unlikeTrack(state, id) {
    if (id == state.trackId) state.isTrackLiked = false;
    state.generalLiked = false;
  },
  likeTrack(state, id) {
    if (id == state.trackId) state.isTrackLiked = true;
    state.generalLiked = true;
  },
  setTrackUrl(state, trackUrl) {
    state.trackUrl = trackUrl;
  },
  setId(state, id) {
    state.trackId = id;
  },
  setFirstTrackInQueue(state, a) {
    state.isFirstTrackInQueue = a;
  },
  setLastTrackInQueue(state, a) {
    state.isLastTrackInQueue = a;
  },
  setQueueTracks(state, queueTracks) {
    state.queueTracks = queueTracks;
  },
  setTrackId(state, trackId) {
    state.trackId = trackId;
  },
  setTrackTotalDuration(state, trackTotalDuration) {
    state.trackTotalDuration = trackTotalDuration;
  },
  setAudioElement(state, audioElement) {
    state.audioElement = audioElement;
  },
  setIsTrackPaused(state, isTrackPaused) {
    state.isTrackPaused = isTrackPaused;
  },
  setIsQueueOpened(state, isQueueOpened) {
    state.isQueueOpened = isQueueOpened;
  },
  setIsTrackLoaded(state, isTrackLoaded) {
    state.isTrackLoaded = isTrackLoaded;
  },
  setIsTrackLiked(state, isTrackLiked) {
    state.isTrackLiked = isTrackLiked;
  },
  setIsBuffering(state, isBuffering) {
    state.isBuffering = isBuffering;
  },
  setToken(state, token) {
    state.token = token;
  },
};

const actions = {
  async getTrackInformation({ state }, payload) {
    if (payload.trackId != null) {
      state.isCurTrkReady = false;

      await axios
        .get("/v1/users/track/" + payload.trackId, {
          headers: {
            Authorization: payload.token,
          },
        })
        .then(async (response) => {
          let trackData = response.data;

          state.trackName = trackData.name;
          state.trackTotalDurationMs = trackData.durationMs;
          state.trackId = trackData.trackId;

          state.trackAlbumImageUrl = trackData.album.image;
          state.trackAlbumName = trackData.album.name;

          await axios
            .get("/v1/artists/" + trackData.artist._id, {
              headers: {
                Authorization: payload.token,
              },
            })
            .then((response) => {
              state.trackArtistName = response.data.name;
            });

          state.isCurTrkReady = true;
        })
        .catch((error) => {
          console.log("axios caught an error");
          console.log(error);
        });
    }
  },
  checkSaved({ commit }, payload) {
    if (payload.token == null) {
      commit("unlikeTrack", payload.trackId);
    } else {
      axios
        .get("/v1/me/tracks/contains?ids=" + payload.trackId, {
          headers: {
            Authorization: `Bearer ${payload.token}`,
          },
        })
        .then((response) => {
          let isTrackLiked = response.data;
          commit("setLiked", { status: isTrackLiked, id: payload.trackId });
        })
        .catch((error) => {
          console.log("axios caught an error");
          console.log(error);
        });
    }
  },
  removeSavedTrack({ commit }, payload) {
    axios
      .delete("/v1/me/tracks", {
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
        data: payload.id,
      })
      .then(() => {
        //   if(id[0]==state.trackId)           //comment it for now
        commit("unlikeTrack", payload.id);
      })
      .catch((error) => {
        console.log("axios caught an error");
        console.log(error);
      });
  },
  saveTrack({ commit }, payload) {
    axios
      .put(
        "/v1/me/tracks?ids=" + payload.id,
        {},
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
          },
        }
      )
      .then(() => {
        //if(id[0]==state.trackId)
        commit("likeTrack", payload.id);
      })
      .catch((error) => {
        console.log("axios caught an error");
        console.log(error);
      });
  },
  /**
   * update the queue
   * @public
   * @param {string} token the authorization token with the Bearer prefix
   */
  async updateQueue({ state }, token) {
    await axios({
      method: "get",
      url: "/v1/me/player/queue",
      headers: {
        Authorization: token,
      },
    }).then(async (response) => {
      state.queueTracks = response.data.data.queueTracks;

      if (response.data.data.previousTrack == null) {
        state.isFirstTrackInQueue = true;
      } else {
        state.isFirstTrackInQueue = false;
      }

      if (response.data.data.nextTrack == null) {
        state.isLastTrackInQueue = true;
      } else {
        state.isLastTrackInQueue = false;
      }
    });
  },
  /**
   * update the queue next songs data
   * @public
   */
  async updateQueueTracksInfo({ state }, token) {
    //get the start of next songs
    var i;
    var tempTrackUrl;
    var songId;

    for (i = 0; i < state.queueTracks.length; i++) {
      tempTrackUrl = state.queueTracks[i];

      songId = tempTrackUrl.slice(
        tempTrackUrl.indexOf("/tracks/") + "/tracks/".length,
        tempTrackUrl.length
      );
      if (state.trackId == songId) {
        break;
      }
    }

    var tracks = [];

    //request the data
    for (var j = i + 1; j < state.queueTracks.length; j++) {
      tempTrackUrl = state.queueTracks[j];

      songId = tempTrackUrl.slice(
        tempTrackUrl.indexOf("/tracks/") + "/tracks/".length,
        tempTrackUrl.length
      );

      var track = {
        name: undefined,
        artistName: undefined,
      };

      await axios
        .get("/v1/users/track/" + songId, {
          headers: {
            Authorization: token,
          },
        })
        .then(async (response) => {
          let trackData = response.data;

          track.name = trackData.name;
          track.durationMs = trackData.durationMs;

          //get the artist name
          await axios
            .get("/v1/artists/" + trackData.artist, {
              headers: {
                Authorization: token,
              },
            })
            .then((response) => {
              track.artistName = response.data.name;
            });

          await axios
            .get("/v1/albums/" + trackData.album, {
              headers: {
                Authorization: token,
              },
            })
            .then((response) => {
              track.trackAlbumName = response.data[0].name;
            });
        });
      tracks.push(track);
    }
    state.queueNextTracks = tracks;
  },
  /**
   * toggle soundplayer pause and play
   * @public
   */
  togglePauseAndPlay({ state }) {
    if (!state.isTrackPaused) {
      state.audioElement.pause();
    } else {
      state.audioElement.play();
    }
  },
  /**
   * get the currently playing track id
   *
   * @public
   * @returns {string} the track id
   */
  async getCurrentlyPlayingTrackId({ state }) {
    //get the currently playing track
    var songId;
    await axios({
      method: "get",
      url: "/v1/me/player/currently-playing",
      headers: {
        Authorization: state.token,
      },
    }).then((response) => {
      //get the track url
      var tempTrackUrl = response.data.data.currentTrack;
      //get the track id
      if (tempTrackUrl != null) {
        songId = tempTrackUrl.slice(
          tempTrackUrl.indexOf("/tracks/") + "/tracks/".length,
          tempTrackUrl.length
        );
      } else {
        songId = null;
      }
    });
    return songId;
  },
  /**
   * get the next song
   *
   * @public
   */
  next({ state, dispatch }) {
    if (!state.isLastTrackInQueue && state.isNextAndPreviousFinished) {
      state.isNextAndPreviousFinished = false;

      state.isBuffering = true;
      state.audioElement.autoplay = true;

      axios({
        method: "post",
        url: "/v1/me/player/next",
        headers: {
          Authorization: state.token,
        },
      }).then(async () => {
        var CurrentlyPlayingTrackId = await dispatch(
          "getCurrentlyPlayingTrackId"
        );
        dispatch("getTrackInformation", {
          token: state.token,
          trackId: CurrentlyPlayingTrackId,
        });
        await dispatch("updateQueue", state.token);

        dispatch("playTrackInQueue", CurrentlyPlayingTrackId);

        state.isNextAndPreviousFinished = true;
      });
    }
  },
  /**
   * get the previous song
   *
   * @public
   */
  previous({ state, dispatch }) {
    if (!state.isFirstTrackInQueue && state.isNextAndPreviousFinished) {
      state.isNextAndPreviousFinished = false;

      state.isBuffering = true;
      state.audioElement.autoplay = true;

      axios({
        method: "post",
        url: "/v1/me/player/previous",
        headers: {
          Authorization: state.token,
        },
      }).then(async () => {
        var CurrentlyPlayingTrackId = await dispatch(
          "getCurrentlyPlayingTrackId"
        );
        dispatch("getTrackInformation", {
          token: state.token,
          trackId: CurrentlyPlayingTrackId,
        });
        await dispatch("updateQueue", state.token);

        dispatch("playTrackInQueue", CurrentlyPlayingTrackId);

        state.isNextAndPreviousFinished = true;
      });
    }
  },
  /**
   * play a song in the queue
   *
   * @public
   *
   * @param {string} trackId the track Id to be played
   */
  playTrackInQueue({ state }, trackId) {
    if (trackId != null) {
      axios({
        method: "post",
        url: "/v1/me/player/tracks/" + trackId,
        data: {
          device: "Chrome",
        },
        headers: {
          Authorization: state.token,
        },
      }).then((response) => {
        var trackToken = response.data.data;
        var audioSource =
          axios.defaults.baseURL +
          "/v1/me/player/tracks/" +
          trackId +
          "/" +
          trackToken;
        state.trackUrl = audioSource;
      });
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
