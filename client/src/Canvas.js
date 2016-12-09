import React, { Component } from 'react';

class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      context: null
    }
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    this.setState({context: ctx})
  }

  //componentDidMount() {
  //  const imgFileLoader = document.querySelector('#imgInput')
  //  imgFileLoader.addEventListener('change', this.showImage, false)
  //}

  showImage = (e) => {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    this.setState({context: ctx})
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          canvas.width,
          canvas.height)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(e.target.files[0])
  }

  checkPixels = () => {
    let r = 0
    let g = 0
    let b = 0
    let count = 0;
    // [ 29, 59, 9, 255]

    console.time('loop')

    for (let x = 0; x < this.state.context.canvas.clientWidth; x++) {
      for (let y = 0; y < this.state.context.canvas.clientHeight; y++) {
        const pixelData = this.state.context.getImageData(x, y, 1, 1)

        r += pixelData.data[0]
        g += pixelData.data[1]
        b += pixelData.data[2]
        count++

      }
    }

    console.timeEnd('loop')

    console.log(`RGB total: ${r}, ${g}, ${b}`)

    r = Math.floor(r / count * 10)
    g = Math.floor(g / count * 10)
    b = Math.floor(b / count * 10)

    console.log(`RGB average: ${r}, ${g}, ${b}`)
    const avCnvs = document.querySelector('#average').getContext('2d')
    avCnvs.fillStyle = `rgb(${r}, ${g}, ${b})`
    avCnvs.fillRect(0, 0, 50, 50)
  }

  render() {
    return (
      <div>
        <canvas ref="canvas"></canvas>
        <canvas id="average" width="50" height="50"></canvas><br/>
        <input id="imgInput" type="file" onChange={this.showImage} /><br/>
        <button onClick={this.checkPixels}>Check</button>
      </div>
    );
  }
}

export default Canvas;
