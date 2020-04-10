import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from 'vuex'

import likedSongs from "@/views/LikedSongs.vue";
import Song from "@/components/general/Song.vue"

describe("Liked Songs", () => {
  let wrapper;
  let vuetify;
  let store;

  beforeEach(() => {
    vuetify = new Vuetify();
    Vue.use(Vuetify);
    Vue.use(Vuex);

    store = new Vuex.Store({
      modules: {
        category: {
          namespaced: true,
          state: {
            tracks:[{
              "name": "Sulk",
              "durationMs": 30000,
              "_id": "5e8a39f24e11cd46c8bde654",
              "artist": "5e8b6d866253cb184eaac150",
              "album": "5e8b6d866253cb184eaac150"
            }]
          },

          actions: {
            getTracks: jest.fn()
          }
        }
       },
      track: {
        namespaced: true,
        state: {
          generalLiked: true
        }
      }
    });

    wrapper = shallowMount(likedSongs, {
      vuetify,
      store
    });
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renders a vue instance", () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });

  it("Contains Play Button", () =>{
    const btn = wrapper.find("#playBtn");
    expect(btn.text() == "Play").toBe(true);
  });

  it("Contains Liked Songs Image",() => {
    const img=wrapper.find("#playPhoto");
    expect(img.exists()).toBe(true);
  });

  it("Contains Song component", () => {
    expect(wrapper.contains(Song)).toBe(true);
  });

  it("Get Saved tracks", async() =>{
    wrapper.vm.$emit('updateContent');
    await wrapper.vm.$nextTick()
    wrapper.emitted('updateContent');
    expect("getTracks").toHaveBeenCalled;
  });
});
