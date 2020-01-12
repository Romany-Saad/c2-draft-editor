import React, { Component } from 'react'
import PropTypes from 'prop-types'
import utils from 'draft-js-video-plugin/lib/video/utils/index'

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/'
const VIMEO_PREFIX = 'https://player.vimeo.com/video/'

const {isYoutube, getYoutubeSrc, isVimeo, getVimeoSrc} = utils

const getSrc = ({src}) => {
  if (isYoutube(src)) {
    const {srcID} = getYoutubeSrc(src)
    return `${YOUTUBE_PREFIX}${srcID}`
  }
  if (isVimeo(src)) {
    const {srcID} = getVimeoSrc(src)
    return `${VIMEO_PREFIX}${srcID}`
  }
  return src
}

class VideoComponent extends Component {

  render() {
    let {blockProps, className, style, theme, children} = this.props
    const src = getSrc(blockProps)

    return (
      <div style={style}>
        <div className={`${theme.iframeContainer} ${className}`}>
          {(isYoutube(blockProps.src) || isVimeo(blockProps.src))
            ?
            <div className="video resp-container">
              <iframe
                id={'iframe'}
                className={theme.iframe}
                src={src}
                style={
                  {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '75%',
                    border: '0',
                  }
                }
                frameBorder="0"
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
              />
            </div>
            :
            <video controls autoPlay style={{maxWidth: '100%'}} className={theme.iframe}>
              <source src={blockProps.src}/>
            </video>
          }
          {children}
        </div>
      </div>
    )
  }
}

VideoComponent.defaultProps = {className: ''}

VideoComponent.propTypes = {
  blockProps: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.object.isRequired,
}
export default VideoComponent
