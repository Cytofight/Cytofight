// import React, {Component} from 'react'

// class Canvas extends React.Component {
//   constructor(props) {
//     super(props)
//     this.updateCanvas = this.updateCanvas.bind(this)
//   }
//   componentDidMount() {
//     this.updateCanvas()
//   }
//   updateCanvas() {
//     const ctx = this.refs.canvas.getContext('2d')
//     const img = this.props.image
//     ctx.drawImage(img, 0, 0)
//   }
//   render() {
//     console.log("Here's the image:", this.props.image)
//     return (
//       <div>
//         <canvas ref="canvas" width={340} height={325} />
//         <img ref={this.props.image} />
//       </div>
//     )
//   }
// }
// export default Canvas
