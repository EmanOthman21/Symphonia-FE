// this module to handle the array of objects to be rendered in the home page of the webplayer
import axios from "axios";
import playlistModule from "./playlist.js";

const token = localStorage.getItem("userToken");

const state = {
  tracks: [],
  recentlyPlayed: {
    categoryName: "Recently Played",
    showSeeAll: false,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Save to Your Library" },
        { title: "Copy Playlist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: null
  },
  heavyRoatation: {
    categoryName: "Your heavy rotation",
    showSeeAll: false,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Save to Your Library" },
        { title: "Copy Playlist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: null
  },
  likedPlaylists: {
    categoryName: "Your playlists",
    showSeeAll: false,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Save to Your Library" },
        { title: "Copy Playlist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: null
  },
  popularPlaylists: {
    categoryName: "Popular playlists",
    showSeeAll: true,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Save to Your Library" },
        { title: "Copy Playlist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: null
  },
  popularArtists: {
    categoryName: "Popular Artists",
    showSeeAll: true,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Follow" },
        { title: "Copy Artist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: "artist"
  },
  popCategory: {
    categoryName: "Pop",
    showSeeAll: true,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Save to Your Library" },
        { title: "Copy Playlist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: null
  },
  folkCategory: {
    categoryName: "Folk",
    showSeeAll: true,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Save to Your Library" },
        { title: "Copy Playlist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: null
  },
  rockCategory: {
    categoryName: "Rock",
    showSeeAll: true,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Save to Your Library" },
        { title: "Copy Playlist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: null
  },
  jazzCategory: {
    categoryName: "Jazz",
    showSeeAll: true,
    list: {
      menuList: [
        { title: "Start Radio" },
        { title: "Save to Your Library" },
        { title: "Copy Playlist Link" }
      ],
      showMenu: false,
      hoveredCardIndex: null,
      items: []
    },
    style: null
  },
  categories: []
};

const mutations = {
  load_popPlaylists(state, payload) {
    state.popCategory.list.items = payload;
    state.categories.push(state.popCategory);
  },
  load_folkPlaylists(state, payload) {
    state.folkCategory.list.items = payload;
    state.categories.push(state.folkCategory);
  },
  load_rockPlaylists(state, payload) {
    state.rockCategory.list.items = payload;
    state.categories.push(state.rockCategory);
  },
  load_jazzPlaylists(state, payload) {
    state.jazzCategory.list.items = payload;
    state.categories.push(state.jazzCategory);
  },
  emptyArray(state) {
    state.categories = [];
  },
  load_popularPlaylists(state, payload) {
    let newList = [];
    payload.forEach(element => {
      var k = {
        name: element.name,
        image: element.images[0].url,
        description: element.description,
        id: element.id,
        url: "url to be added"
      };
      newList.push(k);
    });
    state.popularPlaylists.list.items = newList;
    state.categories.push(state.popularPlaylists);
  },
  load_popularArtists(state, payload) {
    let newList = [];
    payload.forEach(element => {
      var k = {
        name: element.name,
        image: element.images[0].url,
        description: element.description,
        id: element.id,
        url: "url to be added"
      };
      newList.push(k);
    });
    state.popularArtists.list.items = newList;
    state.categories.push(state.popularArtists);
  },
  load_personalSections(state) {
    state.recentlyPlayed.list.items = playlistModule.state.likedPlaylists;
    state.categories.push(state.recentlyPlayed);
    state.heavyRoatation.list.items = playlistModule.state.likedPlaylists;
    state.categories.push(state.heavyRoatation);
    state.likedPlaylists.list.items = playlistModule.state.likedPlaylists;
    state.categories.push(state.likedPlaylists);
  },
  load_tracks(state, list) {
    state.tracks = list;
  }
};

const actions = {
  getPopularPlaylists({ commit }) {
    axios
      .get("/v1/me/popularPlaylists")
      .then(response => {
        let playlists = response.data;

        commit("load_popularPlaylists", playlists);
      })
      .catch(error => {
        console.log("axios caught an error");
        console.log(error);
      });
  },
  getPopularArtists({ commit }) {
    axios
      .get("/v1/me/popularArtists")
      .then(response => {
        let artists = response.data;
        commit("load_popularArtists", artists);
      })
      .catch(error => {
        console.log("axios caught an error");
        console.log(error);
      });
  },
  getGenrePlaylists({ commit }, category_id) {
    commit("emptyArray");
    axios
      .get("v1/browse/categories/" + category_id + "/playlists")
      .then(response => {
        let genreList = response.data;
        let newList = [];
        genreList.forEach(element => {
          var k = {
            name: element.name,
            image: element.images[0].url,
            description: element.description,
            id: element.id,
            url: "url to be added"
          };
          newList.push(k);
        });
        if (category_id == "pop") commit("load_popPlaylists", newList);
        else if (category_id == "folk") commit("load_folkPlaylists", newList);
        else if (category_id == "rock") commit("load_rockPlaylists", newList);
        else commit("load_jazzPlaylists", newList);
      })
      .catch(error => {
        console.log("axios caught an error");
        console.log(error);
      });
  },
  loadGenres({ dispatch }) {
    let genres_ids = ["pop", "folk", "rock", "jazz"];
    genres_ids.forEach(element => {
      dispatch("getGenrePlaylists", element);
    });
  },
  async loadUserSections({ dispatch, commit }) {
    await dispatch("playlist/getPlaylists", null, { root: true });
    commit("load_personalSections");
  },
  getTracks({ commit }) {
    axios
      .get("/v1/me/tracks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        let list = response.data;
        commit("load_tracks", list);
      })
      .catch(error => {
        console.log("axios caught an error");
        console.log(error);
      });
  }
};

const getters = {
  categoriesGetter: function(state) {
    return state.categories;
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
