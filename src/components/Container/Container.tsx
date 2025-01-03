import styles from './Container.module.css'

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div className={styles.Container}>{children}</div>
}
