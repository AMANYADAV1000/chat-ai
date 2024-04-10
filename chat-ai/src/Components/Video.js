import React from 'react'
// import {DefaultPlayer as Video} from 'react-html5video';
import ReactPlayer from 'react-player'
import video from './video/video.mp4'
const Video = () => {


    
  return (
    <div className='player-wrapper'>
        
        <ReactPlayer url={video}   width="90%" height="90%" controls={true} />
    
</div>
  )
}

export default Video
