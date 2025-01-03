export const nullable = <T, R>(
    predition: T,
    render: (val: NonNullable<T>) => R,
    fallback?: R
) => {
    if (predition != null && predition) {
        return render(predition)
    }

    return fallback || null
}

export const nullableClassName = <T>(
    prediction: T,
    first: string,
    second: string = ''
): string => {
    const wrap = nullable(prediction, () => first, second)

    if (wrap == null) {
        return second
    }

    return wrap
}
