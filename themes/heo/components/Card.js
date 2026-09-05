const Card = ({ children, headerSlot, className }) => {
  return (
    <div
      className={`${className || ''} heo-aside-card rounded-xl p-4 lg:p-6`}>
      <>{headerSlot}</>
      <section>{children}</section>
    </div>
  )
}
export default Card
