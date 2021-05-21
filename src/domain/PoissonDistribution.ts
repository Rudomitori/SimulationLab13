export function getPoisson(lambda: number): number{
    let l = Math.exp(-lambda);
    let p = 1;
    let m = -1;

    do{
        m++;
        p *= Math.random();
    } while (p > l);

    return m - 1;
}

export function getProbability(k: number, lambda: number):number {
    let res = Math.pow(lambda, k)
    for(let i = 1; i <= k; i++) {
        res /= i
    }
    res *= Math.exp(-lambda)
    return res
}