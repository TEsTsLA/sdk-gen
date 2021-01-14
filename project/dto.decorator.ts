export function Dto<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
    }
}