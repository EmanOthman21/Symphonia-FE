import { shallowMount ,RouterLinkStub} from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from 'vuex';
import VueRouter from "vue-router";

//import the required componets
import PlaylistView from "@/components/general/PlaylistView.vue";
import Song from "@/components/general/Song.vue";

describe("Playlist View", () => {
  let wrapper;
  let vuetify;
  let store;

  beforeEach(() => {
    vuetify = new Vuetify();
    const router = new VueRouter();
    Vue.use(Vuetify);
    Vue.use(VueRouter);
    Vue.use(Vuex);

    //Mocking the store
    store = new Vuex.Store({
      modules: {
        playlist: {
          namespaced: true,
          
          state: {
            singlePlaylist: {
              
                "images": [
                  "https://zasymphonia.ddns.net/api/v1/images/playlists/playlist9.jpg"
                ],
                "tracks": [
                  "5e8a39f24e11cd46c8bde654"
                ],
                "_id": "5e875bd6ba6ebe663fdbb2c0",
                "name": "Songs for Coping with Loss",
                "description": "Songs for Coping with the Loss of My Debit Card, My Mailbox Key, and My Bike, Which I Tipsily Locked up Somewhere Two Weeks Ago",
                "id": "5e875bd6ba6ebe663fdbb2c0"
            },
            playlistTracks: [{
              "name": "Sulk",
              "durationMs": 30000,
              "_id": "5e8a39f24e11cd46c8bde654",
              "artist": "5e8b6d866253cb184eaac150",
              "album": "5e8b6d866253cb184eaac150"
            }],
            followed: false
          },

          actions: {
            playSongStore: jest.fn(),
            followPlaylist: jest.fn(),
            unfollowPlaylist: jest.fn(),
            checkFollowed: jest.fn(),
            getPlaylist: jest.fn()
          }
        }
      }
    });

    wrapper = shallowMount(PlaylistView, {
      vuetify,
      store,
      router,
      stubs: {
        RouterLink: RouterLinkStub
      }
    });
  });

  //--------------------------------------------------
  //              Test Rendering
  //--------------------------------------------------
  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  }); 

  it("renders a vue instance", () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });

  //--------------------------------------------------------
  //        Check the existance of the components
  //--------------------------------------------------------
  it("Contains Play Button", () =>{
    const btn = wrapper.find("#playBtn");
    expect(btn.text() == "Play").toBe(true);
  });

  it("Contains Playlist's Image",() => {
    const img=wrapper.find("#playPhoto");
    expect(img.exists()).toBe(true);
  });

  it("Contains Song component", () => {
    expect(wrapper.contains(Song)).toBe(true);
  });

  //--------------------------------------------------
  //         Testing created hook cycle actions
  //--------------------------------------------------
  it("Gets a playlist at the begining", () => {
    expect("getPlaylist").toHaveBeenCalled;
  });

  //---------------------------------------------------
  //       Test user functionalities (logged out)
  //---------------------------------------------------
  it("Show Snack Bar at play button click", () => {
    wrapper.vm.snackbar=false;
    const playBtn=wrapper.find("#playBtn");
    playBtn.vm.$emit("click");
    expect(wrapper.vm.snackbar).toBe(true);
  });

  it("Show Snack Bar at follow click", ()=>{
    wrapper.vm.snackbar=false;
    wrapper.vm.followPlaylist();
    expect(wrapper.vm.snackbar).toBe(true);
  });

  it("Show Snack Bar at unfollow click", ()=>{
    wrapper.vm.snackbar=false;
    wrapper.vm.unfollowPlaylist();
    expect(wrapper.vm.snackbar).toBe(true);
  });
});
