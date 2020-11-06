import { writable } from 'svelte/store';

// state

const state = {
    initialized: false,
    signedIn: false,
    username: undefined,
    error: undefined
}

// action creators

const actionCreators = (store) => {
  return {
    initialize: () => {
      userbase.init({ appId: '5b975c6f-3f35-48f4-b92f-904372fbcb3b' })
            .then((session) => {
                if (session.user) {
                    store.dispatch(SignedIn(session.user.username))
                } else {
            store.dispatch(SignedOut())
                }
            })
            .catch((e) => store.dispatch(Error(e)))
            .finally(() => store.dispatch(Initialized()))
    },
    signUp: (username, password, rememberMe) => {
      userbase.signUp({ username, password, rememberMe: rememberMe ? 'local' : '' }) /* TODO: Check into rememberMe functionality */
        .then((user) => store.dispatch(SignedIn(username)))
        .catch((e) => store.dispatch(Error(e)))
    },
    signIn: (username, password, rememberMe) => {
      userbase.signIn({ username, password, rememberMe: rememberMe ? 'local' : '' }) /* TODO: Check into rememberMe functionality */
        .then((user) => store.dispatch(SignedIn(username)))
        .catch((e) => store.dispatch(Error(e)))
    },
    signOut: () => {
        userbase.signOut()
            .then(() => store.dispatch(SignedOut()))
            .catch((e) => store.dispatch(Error(e)))
    }
  }
}

// actions

const Initialized = () => ({ name: "Initialized" })
const SignedIn = (username) => ({ name: "SignedIn", username })
const SignedOut = () => ({ name: "SignedOut" })
const Error = (error) => ({ name: "Error", error })

// reducer

const reducer = (state, action) => {
  switch (action.name) {
    case "Initialized":
      return { ...state,
        initialized: true
      };

    case "SignedIn":
      return { ...state,
        username: action.username,
        signedIn: true,
        error: undefined
      };

    case "SignedOut":
      return { ...state,
        username: undefined,
        signedIn: false,
        error: undefined
      };

    case "Error":
      return { ...state,
        error: action.error
      }

    default:
      return state;
  }
};

// flux store

class Store {
  constructor(subscribe, updateState, reducer) {
    this.updateState = updateState
    this.reducer = reducer

    this.unsubscribe = subscribe(newState => this.state = newState)
  }

  dispatch(action) {
    this.updateState(s => this.reducer(s, action))
  }
}

// svelte store

function createUserAccountStore() {
    const { subscribe, update, set } = writable(state);
  const store = new Store(subscribe, update, reducer)
  const actions = actionCreators(store)

    return {
    ...actions,
        subscribe
    };
}

export const userAccountStore = createUserAccountStore();