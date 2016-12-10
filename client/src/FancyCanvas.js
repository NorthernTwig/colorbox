import React, { Component } from 'react'
import {EventEmitter} from 'fbemitter'
import request from 'superagent'
import axios from 'axios'
import './FancyCanvas.css'
const emitter = new EventEmitter()

export default class FancyCanvas extends Component {
  constructor() {
    super()
    this.state = {
      context: null,
      flowRight: false,
      flowLeft: true,
      imageData: null,
      imageColor: null,
      file: null,
      images: null,
      testing: []
    }
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    this.setState({context: ctx})
    this.setListener()
    this.reRender()
    emitter.emit('render')
  }

  showImage = (e) => {
    const ctx = this.state.context
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = (e) => {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height)
          this.setState({
            imageData: e.path[0].src
          })
          emitter.emit('loaded')
        }
        img.src = ev.target.result
    }
    this.setState({file: e.target.files[0]})
    reader.readAsDataURL(e.target.files[0])
  }

  setListener() {
    emitter.addListener('loaded', () => {
      let r = 0
      let g = 0
      let b = 0
      let count = 0
      for (let x = 0; x < this.state.context.canvas.clientWidth; x++) {
        for (let y = 0; y < this.state.context.canvas.clientHeight; y++) {
          const pixelData = this.state.context.getImageData(x, y, 1, 1)

          r += pixelData.data[0]
          g += pixelData.data[1]
          b += pixelData.data[2]
          count++

        }
      }

      r = Math.floor(r / count)
      g = Math.floor(g / count)
      b = Math.floor(b / count)

      this.refs.circle.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
      this.setState({
        imageColor: {r: r, g: g, b: b}
      })
    })
  }

  toggleLeftRight = (e) => {
    const flowLeft = this.state.flowLeft ? false : true
    const flowRight = this.state.flowRight ? false : true
    this.setState({flowLeft: flowLeft, flowRight: flowRight})
  }

  save(e) {
    e.preventDefault()

    const file = this.state.file

    const fd = new FormData()
    fd.append('file', file)
    fd.append('color', JSON.stringify(this.state.imageColor))

    request
      .post('http://localhost:3001/images/save')
      .send(fd)
      .end((err, res) => {
      emitter.emit('render')
    })

  }

  reRender() {
    emitter.addListener('render', () => {
      this.getImages()
      .then(() => this.settingImages())
    })
  }

  getImages() {
    return new Promise(res => {
      axios('http://localhost:3001/images/load', {
        method: 'GET'
      })
      .then(l => {
        let imageArray = []
        for (let i = 0; i < l.data.length; i++) {
          imageArray.push({'path': l.data[i].path, 'color': l.data[i].color})
        }
        return this.setState({images: imageArray})
      })
      .then(() => res())
    })
  }

  settingImages() {
    let omg = []
    let amg = []
      for (let i = 0; i < this.state.images.length; i++) {
        let asdiaisdu = JSON.parse(this.state.images[i].color)
        let buildit = 'rgb(' + asdiaisdu.r + ', ' + asdiaisdu.g + ', ' + asdiaisdu.b + ')'
        let styleish = {backgroundImage: 'url(http://localhost:3001/images/load/' + this.state.images[i].path + ')', borderBottomColor: buildit}
        omg.push(<div key={i} className='image' style={styleish}></div>)
        if (i % 3 === 0) {
          amg.push(<div className='row' key={'king' + i}>{omg}</div>)
          omg = []
        }
      }
    amg.push(<div className='row' key={'king end'}>{omg}</div>)
    this.setState({testing: [...amg]})
  }

  render() {
    let hej = this.state.flowLeft ? 'body-upload left' : 'body-upload'
    let hejsan = this.state.flowRight ? 'body-container right' : 'body-container'
    return (
        <div className='wrapper'>
          <div className='container'>
            <div className='header'>
              <p className='option upload' onClick={this.toggleLeftRight}>UPLOAD</p>
              <p className='option'>RED</p>
              <p className='option'>GREEN</p>
              <p className='option'>BLUE</p>
            </div>
            <div className='body'>
            <div className={hej} ref='bodyUploadRef'>
              <canvas ref='canvas' width='500' height='500'>Du har inte Canvas din buse</canvas>
              <form ref="kingen" encType="multipart/form-data">
                <input type='file' name='file' id='file' className='inputfile' onChange={this.showImage} />
                <label htmlFor='file' className='file-button option'>Choose a file</label>
                <input type='button' onClick={this.save.bind(this)} value="afgiahifu"/>
              </form>
              <div className='circle' ref='circle'></div>
            </div>
            <div className={hejsan} ref='bodyContainerRef'>
                {this.state.testing}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
