import { useParams } from "react-router-dom"


export default function VideoPlayer() {
    const {videoId} = useParams()
    console.log(videoId);
    
  return (
    <div>{videoId
        
}</div>
  )
}
