const mod = Math.pow(2, 1 / 12) - 1

export const calcFretsSize = (count: number): number[] => {
    let current = 64

    const sizes: number[] = [16]

    for (let i = 0; i <= count; i += 1) {
        sizes.push(current)
        current = current - current * mod
    }

    return sizes
}
