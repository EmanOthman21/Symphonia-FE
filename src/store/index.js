import Vue from "vue";
import Vuex from "vuex";
//import client from "api-client";
import user from "./modules/user";
import playlist from "./modules/playlist";
import track from "./modules/track";
import player from "./modules/player";
import category from "./modules/category";
import album from "./modules/album";
import artist from "./modules/artist";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    playlist,
    user,
    track,
    player,
    category,
    album,
    artist
  }
});
