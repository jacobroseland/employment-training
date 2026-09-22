import './HelloWorld.css'

function HelloWorld() {
  return (
    <section className="hello-world" aria-labelledby="hello-world-heading">
      <h2 id="hello-world-heading" className="exercise-title">
        Hello, World!
      </h2>

      <h2 className="message">Hello!</h2>
    </section>
  )
}

export default HelloWorld
