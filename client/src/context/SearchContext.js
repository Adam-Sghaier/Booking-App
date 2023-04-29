import { createContext, useEffect, useReducer } from "react";
// Context api(React state managment tool) provides a way to pass data through the component tree without having to pass props down manually at every level.

//1/defining our initial state
const INITIAL_STATE = {
  destination: undefined,
  dates: JSON.parse(localStorage.getItem("dates")) || [],
  options: JSON.parse(localStorage.getItem("options")) || {
    adult: undefined,
    children: undefined,
    room: undefined,
  },
};

// 2/create context using initial state(React.createContext() is all you need. It returns a consumer and a provider. Provider is a component that as it's names suggests provides the state to its children. It will hold the "store" and be the parent of all the components that might need that store. Consumer as it so happens is a component that consumes and uses the state.)
export const SearchContext = createContext(INITIAL_STATE);

// 3/define our app actions using reducer function(Reducers are functions that take the current state and an action as arguments, and return a new state result. In other words, (state, action) => newState.)
const searchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      // every time we change the search info we gonna dispatch(send) this action
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

// 4/defining the context provider:
export const SearchContextProvider = ({ children }) => {
  // The useReducer(reducer, initialState) hook accept 2 arguments: the reducer function and the initial state. The hook then returns an array of 2 items: the current state and the dispatch function.
  const [state, dispatch] = useReducer(searchReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("dates", JSON.stringify(state.dates));
  }, [state.dates]);

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(state.options));
  }, [state.options]);

  return (
    // we should expose a state to the component consuming the data
    <SearchContext.Provider
      value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        state,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
