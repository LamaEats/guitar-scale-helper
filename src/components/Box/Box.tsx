import cn from 'classnames'
import styles from './Box.module.css'

export const Box: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
    children,
    className,
}) => {
    return <div className={cn(styles.Box, className)}>{children}</div>
}
