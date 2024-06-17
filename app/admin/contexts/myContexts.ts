import { ContextType, ReducerAction } from "@/types/common";
import { Context, createContext, Dispatch } from "react";

export function generateContext<T>(initialValue: T ): Context<T> {    
    return createContext<T>(initialValue);
}
export function generateDispatchContext<T>(): Context<Dispatch<ReducerAction<T>> | null> {
    return createContext<Dispatch<ReducerAction<T>> | null>(null)
}