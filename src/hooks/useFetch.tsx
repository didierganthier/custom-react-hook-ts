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

    useEffect(() => {
        // If url is not provided, do nothing
        if (!url) return

        // Flag to keep track of whether the component has unmounted
        let isMounted = true

        // Reset the cancelRequest flag
        cancelRequest.current = false

        // Create an async function to fetch data
        const fetchData = async () => {
            // Dispatch loading action to reset the state
            dispatch({ type: 'loading' })

            // If the data is in cache, use it and return early
            if (cache.current[url]) {
                dispatch({ type: 'fetched', payload: cache.current[url] })
                return
            }

            try {
                // Fetch data from the url
                const response = await fetch(url, options)

                // Throw an error if response status is not ok
                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                // Parse the response as JSON
                const data = await response.json() as T

                // Add the data to cache
                cache.current[url] = data

                // Only update state if the component is still mounted
                if (isMounted && !cancelRequest.current) {
                    dispatch({ type: 'fetched', payload: data })
                }
            } catch (error) {
                // Only update state if the component is still mounted
                if (isMounted && !cancelRequest.current) {
                    dispatch({ type: 'error', payload: error as Error })
                }
            }
        }

        // Call the fetchData function adding void is optional and shows the fetchData function doesnt return any data
        void fetchData()

        // Return a cleanup function to set cancelRequest flag to true when the component unmounts
        return () => {
            cancelRequest.current = true
            isMounted = false
        }
    }, [url, options])

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

export default useFetch;