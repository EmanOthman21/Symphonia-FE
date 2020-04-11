import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import VueRouter from "vue-router";
import soundplayer from "@/components/TheSoundplayer/TheSoundplayer.vue";

describe("TheSoundplayer", () => {
  let wrapper;
  let vuetify;
  let store;

  beforeEach(() => {
    vuetify = new Vuetify();
    const router = new VueRouter();
    Vue.use(Vuetify);
    Vue.use(VueRouter);
    Vue.use(Vuex);

    store = new Vuex.Store({
      modules: {
        track: {
          namespaced: true,

          state: {
            trackName: "",
            liked: null,
            trackUrl: null,
            trackId: null,
            imageUrl: null,
            trackAlbumId: null,
            albumName: "",
            totalDuration: 0,
            totalDurationMs: 0,
            trackArtists: [
              {
                name: "",
                href: ""
              }
            ],
            generalLiked: null,
            firstTrackInQueue: false,
            lastTrackInQueue: false,
            queueTracks: [],
            queueNextTracks: [],
            isCurTrkReady: false
          },
          actions: {
            getQueueStore: () => {} 
          }
        },
        playlist: {
          namespaced: true,

          state:{
            audio: "",
            isQueueOpened: false
          },

          actions: {
            createPlaylist: jest.fn()
          },
          mutations: {
            setAudio: (state, audio) => {state.audio = audio} 
          },
          getters: {
            audio: (state) => {
              return state.audio;
            },
            isQueueOpened: (state) => {
              return state.isQueueOpened;
            },
            paused: (state) => {
              return state.paused;
            },
          }

        }
      }
    });

    wrapper = shallowMount(soundplayer, {
      vuetify,
      store,
      router,
    });
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });
});
