import React, { Component } from 'react';

class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      context: null
    }
  }

  componentDidMount() {
    const ctx = this.refs.canvas.getContext('2d')
    this.setState({context: ctx})
    const imgFileLoader = document.querySelector('#imgInput')
    imgFileLoader.addEventListener('change', this.showImage, false)
  }

  showImage(e) {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
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

  checkPixels() {
    const ctx = this.state.context
    console.log('Checking pixels...')
  }

  render() {
    return (
      <div>
        <canvas ref="canvas"></canvas><br/>
        <input id="imgInput" type="file" onChange={this.showImage} /><br/>
        <button onClick={this.checkPixels}>Check</button>
      </div>
    );
  }
}

export default Canvas;
