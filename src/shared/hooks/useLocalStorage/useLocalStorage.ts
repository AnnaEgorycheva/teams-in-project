import { useEffect, useMemo, useRef, useState } from 'react';

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;
type Setter<T> = React.Dispatch<React.SetStateAction<T | undefined>>;

type Options<T> = Partial<{
    serializer: Serializer<T>;
    parser: Parser<T>;
    logger: (error: any) => void;
    syncData: boolean;
}>;

interface RefObject<T> {
    current: T;
}

function useLocalStorage<T>(key: string, defaultValue: T, options?: Options<T>): [T, Setter<T>];
function useLocalStorage<T>(key: string, defaultValue?: T, options?: Options<T>) {
    const opts = useMemo(
        () => ({
            serializer: JSON.stringify,
            parser: JSON.parse,
            logger: console.log,
            syncData: true,
            ...options,
        }),
        [ options ],
    );

    const { serializer, parser, logger, syncData } = opts;

    const rawValueRef = useRef<string | null>(null) as RefObject<string | null>;

    const [ value, setValue ] = useState(() => {
        if (typeof window === 'undefined') return defaultValue;

        try {
            rawValueRef.current = window.localStorage.getItem(key);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const res: T = rawValueRef.current ? parser(rawValueRef.current) : defaultValue;
            return res;
        } catch (e) {
            logger(e);
            return defaultValue;
        }
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateLocalStorage = () => {
            // Browser ONLY dispatch storage events to other tabs, NOT current tab.
            // We need to manually dispatch storage event for current tab
            if (value !== undefined) {
                const newValue = serializer(value);
                const oldValue = rawValueRef.current;
                rawValueRef.current = newValue;
                window.localStorage.setItem(key, newValue);
                window.dispatchEvent(
                    new StorageEvent('storage', {
                        storageArea: window.localStorage,
                        url: window.location.href,
                        key,
                        newValue,
                        oldValue,
                    }),
                );
            } else {
                window.localStorage.removeItem(key);
                window.dispatchEvent(
                    new StorageEvent('storage', {
                        storageArea: window.localStorage,
                        url: window.location.href,
                        key,
                    }),
                );
            }
        };

        try {
            updateLocalStorage();
        } catch (e) {
            logger(e);
        }
    }, [ value ]);

    useEffect(() => {
        if (!syncData) return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key !== key || e.storageArea !== window.localStorage) return;

            try {
                if (e.newValue !== rawValueRef.current) {
                    rawValueRef.current = e.newValue;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    setValue(e.newValue ? parser(e.newValue) : undefined);
                }
            } catch (e) {
                logger(e);
            }
        };

        if (typeof window === 'undefined') return;

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [ key, syncData ]);

    return [ value, setValue ];
}

type Nullable<T> = T | null;

function getStorageValue<T>(key: string): Nullable<T> {
    if (typeof window === 'undefined') {
        console.warn(`Tried getting localStorage key “${key}” even though environment is not a client`);
        return null;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return null;
    }
}

function setStorageValue<T>(key: string, initialValue: T) {
    if (typeof window === 'undefined') {
        console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);
    }
    try {
        if (typeof window !== 'undefined') {
            if (initialValue === undefined) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(initialValue));
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export { getStorageValue, setStorageValue };
export default useLocalStorage;
