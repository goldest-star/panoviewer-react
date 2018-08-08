import propTypes from 'prop-types';
import React, { Component } from 'react';
import videojs from 'video.js'
import '../pannellum/css/video-js.css';
import '../pannellum/css/pannellum.css';
import '../pannellum/js/libpannellum.js';
import '../pannellum/js/RequestAnimationFrame';
import '../pannellum/js/pannellum.js';
import '../pannellum/js/videojs-pannellum-plugin';


var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};


const Hotspot = () => null;

class PannellumVideo extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: ID()
    };
  }

  static propTypes = {
    children: propTypes.oneOfType([
      propTypes.arrayOf(propTypes.node),
      propTypes.node
    ]),
    id: propTypes.string,
    width: propTypes.string,
    height: propTypes.string,
    video: propTypes.string,
    yaw : propTypes.number,
    pitch: propTypes.number,
    hfov: propTypes.number,
    minHfov: propTypes.number,
    maxHfov: propTypes.number,
    onLoad: propTypes.func,
    onScenechange: propTypes.func,
    onScenechangefadedone: propTypes.func,
    onError: propTypes.func,
    onErrorcleared: propTypes.func,
    onMousedown: propTypes.func,
    onMouseup: propTypes.func,
    onTouchstart: propTypes.func,
    onTouchend: propTypes.func,
    hotspotDebug: propTypes.bool
  }

  static defaultProps = {
    children:[],
    width: '100%',
    height: '400px',
    video:'',
    yaw : 0,
    pitch: 0,
    hfov: 100,
    minHfov: 50,
    maxHfov: 150,
    onLoad: ()=>{},
    onScenechange: ()=>{},
    onScenechangefadedone: ()=>{},
    onError: ()=>{},
    onErrorcleared: ()=>{},
    onMousedown: ()=>{},
    onMouseup: ()=>{},
    onTouchstart: ()=>{},
    onTouchend: ()=>{},
    hotspotDebug: false,
  }

  componentDidMount = () => {

    const { children } = this.props;
    let hotspotArray = [];
    if (Array.isArray(children)){
      children.map(hotspot =>{
        return hotspotArray.push({ 
          "type":hotspot.props.type,
          "pitch":hotspot.props.pitch,
          "yaw":hotspot.props.yaw,
          "text":hotspot.props.text,
          "URL":hotspot.props.URL
        });
      });
    } else {
      hotspotArray.push({ 
        "type":children.props.type,
        "pitch":children.props.pitch,
        "yaw":children.props.yaw,
        "text":children.props.text,
        "URL":children.props.URL
      }
      );
    }

    let jsonConfig = {
      yaw : this.props.yaw,
      pitch: this.props.pitch,
      hfov: this.props.hfov,
      minHfov: this.props.minHfov,
      maxHfov: this.props.maxHfov,
      hotSpotDebug: this.props.hotspotDebug,
      hotSpots: hotspotArray
    };

    Object.keys(jsonConfig).forEach((key) => (jsonConfig[key] === "") && delete jsonConfig[key]);    

    this.video = videojs(this.videoNode, {
      loop: true,
      autoplay: true,
      controls: false,
      plugins: {
        pannellum: {
          hfov: 130,
          minHfov:80,
          maxHfov:130,
          autoRotate:0,
          mouseZoom:true,
          hotSpots: [{
            "pitch": 20.1,
            "yaw": 100.5,
            "type": "info",
            "text": "hotspot",
            "URL": "https://farminf.github.io/"
          }]
        }
      } 
    });
  }

  componentWillUnmount() {
    if (this.video) {
      this.video.dispose();
    }
  }
  
  render() {
    let { width, height, video, ...props } = this.props;
    let divStyle = {
      width : width,
      height : height
    };
    return (

      <div data-vjs-player>
        <video
          id={this.props.id ? this.props.id : this.state.id}
          className="video-js vjs-default-skin vjs-big-play-centered" 
          ref={node => this.videoNode = node}
          preload="none" 
          crossOrigin="anonymous"
          style={divStyle}
        >
          <source 
            src={video}
            type="video/mp4"
          />
        </video>
      </div>
    );
  }
}
PannellumVideo.Hotspot = Hotspot;
export default PannellumVideo;
