import propTypes from 'prop-types';
import React, { Component } from 'react';
import videojs from 'video.js';
import '../pannellum/css/video-js.css';
import '../pannellum/css/pannellum.css';
import '../pannellum/css/style-textInfo.css';
import '../pannellum/js/libpannellum.js';
import '../pannellum/js/RequestAnimationFrame';
import '../pannellum/js/pannellum.js';
import '../pannellum/js/videojs-pannellum-plugin';








class PannellumVideo extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: Math.random().toString(36).substr(2, 9)
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
    hotspotDebug: propTypes.bool,
    autoRotate: propTypes.number,
    mouseZoom: propTypes.bool,
    loop:propTypes.bool,
    autoplay:propTypes.bool,
    controls:propTypes.bool,
    Tooltip: propTypes.func,
    handleClick:propTypes.func,
    name: propTypes.string
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
    hotspotDebug: false,
    autoRotate: 0,
    mouseZoom: true,
    loop:false,
    autoplay:true,
    controls:false,
  }

  renderVideo = () =>{
    const { children } = this.props;
    // make the array of sub components, even if its one, it become array of one 
    let hotspots = [...children];
    console.log(hotspots);
    let hotspotArray = [];
    if (Array.isArray(hotspots)){
      hotspots.map(hotspot =>{
        switch (hotspot.props.type){

          case "info":
            return hotspotArray.push({ 
              "type":hotspot.props.type,
              "pitch":hotspot.props.pitch ? hotspot.props.pitch : 10,
              "yaw":hotspot.props.yaw ? hotspot.props.yaw : 10,
              "text":hotspot.props.text ? hotspot.props.text : "",
              "URL":hotspot.props.URL ? hotspot.props.URL : ""
            });
          case "custom":
            return hotspotArray.push({
              "pitch":hotspot.props.pitch ? hotspot.props.pitch : 10,
              "yaw":hotspot.props.yaw ? hotspot.props.yaw : 10,
              "createTooltipFunc": hotspot.props.Tooltip ? hotspot.props.Tooltip: this.hotspotTooltip,
              "cssClass": "tooltipcss",
              "createTooltipArgs":"",
              "clickHandlerArgs": hotspot.props.name ? hotspot.props.name : "noName",
              "clickHandlerFunc": hotspot.props.handleClick ? hotspot.props.handleClick : hotspot.handleClickHotspot,
            });
          default:
            return [];
        }
        
      });
    }

    this.video = videojs(this.videoNode, {
      loop:this.props.loop,
      autoplay:this.props.autoplay,
      controls:this.props.controls,
      plugins: {
        pannellum: {
          yaw : this.props.yaw,
          pitch: this.props.pitch,
          hfov: this.props.hfov,
          minHfov: this.props.minHfov,
          maxHfov: this.props.maxHfov,
          hotSpotDebug: this.props.hotspotDebug,
          autoRotate:this.props.autoRotate,
          mouseZoom:this.props.mouseZoom,
          showZoomCtrl:true,
          hotSpots: hotspotArray
        }
      } 
    }).src({ type: 'video/mp4', src: this.props.video });
  }

  componentDidMount = () => {
    this.renderVideo();    
  }

  componentDidUpdate (){
    // this.videoNode.setAttribute("src", this.props.video );
    this.renderVideo();  
  }

  handleClickHotspot = (e , id) => {
    console.log("hotspot clicked" , id);
  }


  hotspotTooltip = (hotSpotDiv, args) => {
    hotSpotDiv.setAttribute("id", "textInfo");
    const hDiv = document.createElement('div');
    hDiv.classList.add('hotspot');
    const outDiv = document.createElement('div');
    outDiv.classList.add('out');
    const inDiv = document.createElement('div');
    inDiv.classList.add('in');
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    hotSpotDiv.appendChild(hDiv);
    hDiv.appendChild(inDiv);
    hDiv.appendChild(outDiv);
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
        />
      </div>
    );
  }
}

export default PannellumVideo;
