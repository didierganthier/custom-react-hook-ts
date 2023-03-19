import { useEffect, useReducer, useRef } from 'react';

interface State<T> {
    data?: T;
    error?: Error;
}

type Cache<T> = { [url: string]: T };