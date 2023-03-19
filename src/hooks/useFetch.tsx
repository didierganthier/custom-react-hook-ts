import { useEffect, useReducer, useRef } from 'react';

interface State<T> {
    data?: T;
    error?: Error;
}

type Cache<T> = { [url: string]: T };

type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error };

  function useFetch<T = unknown>(
    url?: string,
    options?: RequestInit
  ): State<T> {
    const cache = useRef<Cache<T>>({})
  
    // Used to prevent state update if the component is unmounted
    const cancelRequest = useRef<boolean>(false)
  
    const initialState: State<T> = {
      error: undefined,
      data: undefined,
    }
  
    // Keep state logic separated
    const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
      switch (action.type) {
        case 'loading':
          return { ...initialState }
        case 'fetched':
          return { ...initialState, data: action.payload }
        case 'error':
          return { ...initialState, error: action.payload }
        default:
          return state
      }
    }
  
    const [state, dispatch] = useReducer(fetchReducer, initialState)
    return state;
  }