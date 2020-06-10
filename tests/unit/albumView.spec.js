import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import VueRouter from "vue-router";

//import the required componets
import AlbumView from "@/components/general/AlbumView.vue";

describe("Album View", () => {
  let wrapper;
  let vuetify;
  let store;
  let trackActions;
  let trackMutations;
  let albumActions;

  beforeEach(() => {
    vuetify = new Vuetify();
    const router = new VueRouter();
    Vue.use(Vuetify);
    Vue.use(VueRouter);
    Vue.use(Vuex);

    trackActions = {
      playTrackInQueue: jest.fn(),
      updateQueue: jest.fn(),
      getTrackInformation: jest.fn(),
      togglePauseAndPlay: jest.fn()
    };

    trackMutations = {
      setContextData: jest.fn(),
      setIsTrackPaused: jest.fn()
    };

    albumActions = {
      followAlbum: jest.fn(),
      unfollowAlbum: jest.fn(),
      checkFollowed: jest.fn(),
      getAlbum: jest.fn()
    };
    //Mocking the store
    store = new Vuex.Store({
      modules: {
        track: {
          namespaced: true,
          state: {
            contextId: "1",
            isTrackPaused: true,
            nonPremiumTrackID: "1"
          },
          mutations: trackMutations,
          actions: trackActions
        },
        album: {
          namespaced: true,

          state: {
            singleAlbum: {
              liked: true,
              tracksCount: "3",
              tracks: ["4", "6", "2"],
              releaseDate: "2020-04-07T16:49:46.442Z",
              _id: "1",
              id: "1",
              name: "Album 3",
              year: 2020,
              image: "http://source.unsplash.com/eSYCRwJEzO8",
              artist: {
                name: "Nasser Al-Qatami",
                _id: "2"
              }
            },
            albumTracks: [
              {
                name: "Sulk",
                durationMs: 30000,
                _id: "5e8a39f24e11cd46c8bde654",
                artist: { _id: "5e8b6d866253cb184eaac150", name: "Symphonia" },
                album: { _id: "5e8b6d866253cb184eaac150", name: "New Album" }
              }
            ],
            isFollowdAlbum: false
          },
          actions: albumActions
        }
      }
    });

    wrapper = shallowMount(AlbumView, {
      vuetify,
      store,
      router,
      stubs: {
        RouterLink: RouterLinkStub
      },
      propsData: {
        contextMenu: {
          event: "event",
          type: "type",
          id: "1234"
        }
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

  //--------------------------------------------------
  //         Testing created hook cycle actions
  //--------------------------------------------------
  it("Gets the Album's data", () => {
    expect("getAlbum").toHaveBeenCalled;
  });

  it("Check if the user's follow this album", () => {
    expect(albumActions.checkFollowed).toHaveBeenCalled();
  });
  //---------------------------------------------------
  //       Test user functionalities
  //---------------------------------------------------
  it("Set menu data", () => {
    wrapper.vm.$emit("contextmenu.prevent");
    expect(wrapper.vm.menuClick()).toHaveBeenCalled;
  });

  it("Play an album", () => {
    const btn = wrapper.find("#playBtn");
    btn.vm.$emit("click");
    expect(wrapper.vm.play()).toHaveBeenCalled;
  });

  it("Follow an album", () => {
    wrapper.vm.followAlbum();
    expect(albumActions.followAlbum).toHaveBeenCalled();
  });

  it("Unfollow an album", () => {
    wrapper.vm.unfollowAlbum();
    expect(albumActions.unfollowAlbum).toHaveBeenCalled();
  });

  it("Pause the currently playing album", () => {
    wrapper.vm.pause();
    expect(trackActions.togglePauseAndPlay).toHaveBeenCalled();
    expect(trackMutations.setIsTrackPaused).toHaveBeenCalled();
  });

  it("Play the album", () => {
    wrapper.vm.id = "1";
    wrapper.vm.play();
    expect(trackActions.togglePauseAndPlay).toHaveBeenCalled();
  });

  it("Contains preimum tracks only", () => {
    store.state.album.nonPremiumTrackID = null;
    wrapper.vm.play();
    expect(trackMutations.setIsTrackPaused).not.toBeCalled();
  });
});
