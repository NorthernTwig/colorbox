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
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        this.state.context.drawImage(img, 0, 0)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(e.target.files[0])
  }

  render() {
    return (
      <div>
        <canvas ref="canvas"></canvas><br/>
        <input id="imgInput" type="file" />
      </div>
    );
  }
}

export default Canvas;
