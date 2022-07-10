// import { v02 } from ".";

let majorMinor = 'v0.1.'
let hotVersion = 0

export function migrations(variables) {
    variables.version = majorMinor + hotVersion
}

export function upgrade(variables, hotfix) {
    if (hotfix === hotVersion){
        // v02.migrations(variables)
        return
    }

    migrations(variables)
}